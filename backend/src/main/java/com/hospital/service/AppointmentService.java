package com.hospital.service;

import com.hospital.dto.AppointmentRequest;
import com.hospital.dto.RescheduleRequest;
import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.entity.TimeSlot;
import com.hospital.entity.User;
import com.hospital.entity.enums.AppointmentStatus;
import com.hospital.entity.enums.TimeSlotType;
import com.hospital.exception.AppointmentException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.TimeSlotRepository;
import com.hospital.repository.UserRepository;
import com.hospital.scheduling.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final ScheduleService scheduleService;
    private final NotificationService notificationService;

    @Value("${app.appointment.cancel-hours-before:24}")
    private int cancelHoursBefore;

    private final ReentrantLock appointmentLock = new ReentrantLock();

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getDoctorAppointmentsByDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndDate(doctorId, date);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
    }

    public Appointment getAppointmentByNo(String appointmentNo) {
        return appointmentRepository.findByAppointmentNo(appointmentNo)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentNo));
    }

    public Appointment createAppointment(AppointmentRequest request) {
        appointmentLock.lock();
        try {
            TimeSlot timeSlot = timeSlotRepository.findById(request.getTimeSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", request.getTimeSlotId()));

            if (!timeSlot.isAvailable() || timeSlot.isCancelled()) {
                throw new AppointmentException("SLOT_UNAVAILABLE", "该时段已停诊");
            }

            if (timeSlot.getRemainingSlots() <= 0) {
                throw new AppointmentException("SLOT_FULL", "该时段号源已满");
            }

            Doctor doctor = doctorRepository.findById(timeSlot.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor", timeSlot.getDoctorId()));

            User patient = userRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getPatientId()));

            boolean hasExistingAppointment = appointmentRepository
                    .findByPatientIdAndTimeSlotId(request.getPatientId(), request.getTimeSlotId())
                    .isPresent();
            if (hasExistingAppointment) {
                throw new AppointmentException("DUPLICATE_APPOINTMENT", "您已预约该时段");
            }

            Integer currentVersion = timeSlot.getVersion();
            boolean success = timeSlotRepository.decreaseRemainingSlots(
                    request.getTimeSlotId(), currentVersion);

            if (!success) {
                throw new AppointmentException("CONCURRENT_BOOKING", "号源被抢占，请重试");
            }

            try {
                Appointment appointment = new Appointment();
                appointment.setAppointmentNo(generateAppointmentNo());
                appointment.setPatientId(request.getPatientId());
                appointment.setPatientName(patient.getName());
                appointment.setDoctorId(timeSlot.getDoctorId());
                appointment.setDoctorName(doctor.getName());
                appointment.setDepartmentId(doctor.getDepartmentId());
                appointment.setDepartmentName(doctor.getDepartmentName());
                appointment.setTimeSlotId(timeSlot.getId());
                appointment.setAppointmentDate(timeSlot.getDate());
                appointment.setTimeSlotType(timeSlot.getTimeSlotType());
                appointment.setStartTime(timeSlot.getStartTime());
                appointment.setEndTime(timeSlot.getEndTime());

                List<Appointment> existingAppointments = appointmentRepository.findByTimeSlotId(timeSlot.getId());
                appointment.setQueueNumber(existingAppointments.size() + 1);

                appointment.setStatus(AppointmentStatus.CONFIRMED);
                appointment.setSymptoms(request.getSymptoms());

                Appointment saved = appointmentRepository.save(appointment);

                notificationService.createAppointmentReminders(saved);

                return saved;
            } catch (Exception e) {
                timeSlotRepository.increaseRemainingSlots(request.getTimeSlotId());
                throw e;
            }
        } finally {
            appointmentLock.unlock();
        }
    }

    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new AppointmentException("ALREADY_CANCELLED", "预约已取消");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new AppointmentException("ALREADY_COMPLETED", "预约已完成，无法取消");
        }

        if (!canCancel(appointment)) {
            throw new AppointmentException("CANCEL_TIME_EXCEEDED",
                    "就诊前" + cancelHoursBefore + "小时内无法取消");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.preUpdate();
        Appointment saved = appointmentRepository.save(appointment);

        timeSlotRepository.increaseRemainingSlots(appointment.getTimeSlotId());

        notificationService.createCancellationNotification(saved);

        return saved;
    }

    public Appointment rescheduleAppointment(RescheduleRequest request) {
        appointmentLock.lock();
        try {
            Appointment original = getAppointmentById(request.getOriginalAppointmentId());

            if (original.getStatus() != AppointmentStatus.CONFIRMED) {
                throw new AppointmentException("INVALID_STATUS", "只有已确认的预约可以改签");
            }

            if (!canCancel(original)) {
                throw new AppointmentException("RESCHEDULE_TIME_EXCEEDED",
                        "就诊前" + cancelHoursBefore + "小时内无法改签");
            }

            TimeSlot newSlot = timeSlotRepository.findById(request.getNewTimeSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", request.getNewTimeSlotId()));

            if (!newSlot.isAvailable() || newSlot.isCancelled()) {
                throw new AppointmentException("SLOT_UNAVAILABLE", "新时段已停诊");
            }

            if (newSlot.getRemainingSlots() <= 0) {
                throw new AppointmentException("SLOT_FULL", "新时段号源已满");
            }

            if (newSlot.getDoctorId().equals(original.getDoctorId())
                    && newSlot.getDate().equals(original.getAppointmentDate())
                    && newSlot.getTimeSlotType().equals(original.getTimeSlotType())) {
                throw new AppointmentException("SAME_SLOT", "不能改签为同一时段");
            }

            Integer newVersion = newSlot.getVersion();
            boolean newSlotSuccess = timeSlotRepository.decreaseRemainingSlots(
                    request.getNewTimeSlotId(), newVersion);

            if (!newSlotSuccess) {
                throw new AppointmentException("CONCURRENT_BOOKING", "新时段号源被抢占，请重试");
            }

            try {
                original.setStatus(AppointmentStatus.RESCHEDULED);
                original.preUpdate();
                appointmentRepository.save(original);

                timeSlotRepository.increaseRemainingSlots(original.getTimeSlotId());

                Doctor doctor = doctorRepository.findById(newSlot.getDoctorId())
                        .orElseThrow(() -> new ResourceNotFoundException("Doctor", newSlot.getDoctorId()));

                Appointment newAppointment = new Appointment();
                newAppointment.setAppointmentNo(generateAppointmentNo());
                newAppointment.setPatientId(original.getPatientId());
                newAppointment.setPatientName(original.getPatientName());
                newAppointment.setDoctorId(newSlot.getDoctorId());
                newAppointment.setDoctorName(doctor.getName());
                newAppointment.setDepartmentId(doctor.getDepartmentId());
                newAppointment.setDepartmentName(doctor.getDepartmentName());
                newAppointment.setTimeSlotId(newSlot.getId());
                newAppointment.setAppointmentDate(newSlot.getDate());
                newAppointment.setTimeSlotType(newSlot.getTimeSlotType());
                newAppointment.setStartTime(newSlot.getStartTime());
                newAppointment.setEndTime(newSlot.getEndTime());

                List<Appointment> existingInNewSlot = appointmentRepository.findByTimeSlotId(newSlot.getId());
                newAppointment.setQueueNumber(existingInNewSlot.size() + 1);

                newAppointment.setStatus(AppointmentStatus.CONFIRMED);
                newAppointment.setSymptoms(original.getSymptoms());

                Appointment saved = appointmentRepository.save(newAppointment);

                notificationService.createRescheduleNotification(saved, original);

                return saved;
            } catch (Exception e) {
                timeSlotRepository.increaseRemainingSlots(request.getNewTimeSlotId());
                timeSlotRepository.decreaseRemainingSlots(original.getTimeSlotId(), null);
                original.setStatus(AppointmentStatus.CONFIRMED);
                appointmentRepository.save(original);
                throw e;
            }
        } finally {
            appointmentLock.unlock();
        }
    }

    public Appointment completeAppointment(Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new AppointmentException("INVALID_STATUS", "只有已确认的预约可以完成");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.preUpdate();
        return appointmentRepository.save(appointment);
    }

    public Appointment markAsMissed(Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);

        appointment.setStatus(AppointmentStatus.MISSED);
        appointment.preUpdate();
        return appointmentRepository.save(appointment);
    }

    public boolean canCancel(Appointment appointment) {
        if (appointment.getAppointmentDate() == null || appointment.getStartTime() == null) {
            return false;
        }
        LocalDateTime appointmentDateTime = LocalDateTime.of(
                appointment.getAppointmentDate(), appointment.getStartTime());
        return LocalDateTime.now().plusHours(cancelHoursBefore).isBefore(appointmentDateTime);
    }

    private String generateAppointmentNo() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uuidPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "APT" + datePart + uuidPart;
    }

    public List<Appointment> getUpcomingAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdAndStatus(patientId, AppointmentStatus.CONFIRMED);
    }

    public List<Appointment> getTodayDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorIdAndDateAndStatus(
                doctorId, LocalDate.now(), AppointmentStatus.CONFIRMED);
    }
}
