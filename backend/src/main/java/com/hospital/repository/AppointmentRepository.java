package com.hospital.repository;

import com.hospital.entity.Appointment;
import com.hospital.entity.enums.AppointmentStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class AppointmentRepository extends AbstractJsonRepository<Appointment> {

    public AppointmentRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "appointments.json", Appointment.class);
    }

    public List<Appointment> findByPatientId(Long patientId) {
        return storage.values().stream()
                .filter(a -> patientId.equals(a.getPatientId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<Appointment> findByDoctorId(Long doctorId) {
        return storage.values().stream()
                .filter(a -> doctorId.equals(a.getDoctorId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<Appointment> findByDoctorIdAndDate(Long doctorId, LocalDate date) {
        return storage.values().stream()
                .filter(a -> doctorId.equals(a.getDoctorId()) && date.equals(a.getAppointmentDate()))
                .sorted((a, b) -> a.getStartTime().compareTo(b.getStartTime()))
                .collect(Collectors.toList());
    }

    public List<Appointment> findByDoctorIdAndDateAndStatus(Long doctorId, LocalDate date, AppointmentStatus status) {
        return storage.values().stream()
                .filter(a -> doctorId.equals(a.getDoctorId())
                        && date.equals(a.getAppointmentDate())
                        && status.equals(a.getStatus()))
                .sorted((a, b) -> a.getStartTime().compareTo(b.getStartTime()))
                .collect(Collectors.toList());
    }

    public List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status) {
        return storage.values().stream()
                .filter(a -> patientId.equals(a.getPatientId()) && status.equals(a.getStatus()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Optional<Appointment> findByAppointmentNo(String appointmentNo) {
        return storage.values().stream()
                .filter(a -> appointmentNo.equals(a.getAppointmentNo()))
                .findFirst();
    }

    public Optional<Appointment> findByPatientIdAndTimeSlotId(Long patientId, Long timeSlotId) {
        return storage.values().stream()
                .filter(a -> patientId.equals(a.getPatientId())
                        && timeSlotId.equals(a.getTimeSlotId())
                        && a.getStatus() != AppointmentStatus.CANCELLED)
                .findFirst();
    }

    public List<Appointment> findByTimeSlotId(Long timeSlotId) {
        return storage.values().stream()
                .filter(a -> timeSlotId.equals(a.getTimeSlotId())
                        && a.getStatus() != AppointmentStatus.CANCELLED)
                .collect(Collectors.toList());
    }

    public List<Appointment> findByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status) {
        return storage.values().stream()
                .filter(a -> date.equals(a.getAppointmentDate()) && status.equals(a.getStatus()))
                .collect(Collectors.toList());
    }
}
