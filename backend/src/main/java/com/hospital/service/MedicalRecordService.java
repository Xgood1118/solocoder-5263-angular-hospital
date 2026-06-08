package com.hospital.service;

import com.hospital.dto.MedicalRecordRequest;
import com.hospital.entity.Appointment;
import com.hospital.entity.FollowUp;
import com.hospital.entity.MedicalRecord;
import com.hospital.entity.enums.AppointmentStatus;
import com.hospital.exception.AppointmentException;
import com.hospital.exception.BusinessException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.FollowUpRepository;
import com.hospital.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final FollowUpRepository followUpRepository;

    @Value("${app.appointment.follow-up-days:3}")
    private int followUpDays;

    public List<MedicalRecord> getPatientRecords(Long patientId, Long currentUserId, String userRole) {
        if ("PATIENT".equals(userRole) && !patientId.equals(currentUserId)) {
            throw new BusinessException("ACCESS_DENIED", "只能查看自己的病历");
        }
        return medicalRecordRepository.findByPatientId(patientId);
    }

    public List<MedicalRecord> getDoctorRecords(Long doctorId, Long currentUserId, String userRole) {
        if ("DOCTOR".equals(userRole) && !doctorId.equals(currentUserId)) {
            throw new BusinessException("ACCESS_DENIED", "只能查看自己写的病历");
        }
        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    public MedicalRecord getRecordById(Long id, Long currentUserId, String userRole) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", id));

        if ("PATIENT".equals(userRole) && !record.getPatientId().equals(currentUserId)) {
            throw new BusinessException("ACCESS_DENIED", "只能查看自己的病历");
        }
        if ("DOCTOR".equals(userRole) && !record.getDoctorId().equals(currentUserId) && !record.isShared()) {
            throw new BusinessException("ACCESS_DENIED", "没有权限查看该病历");
        }

        return record;
    }

    public MedicalRecord getRecordByAppointmentId(Long appointmentId, Long currentUserId, String userRole) {
        MedicalRecord record = medicalRecordRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord not found for appointment: " + appointmentId));

        if ("PATIENT".equals(userRole) && !record.getPatientId().equals(currentUserId)) {
            throw new BusinessException("ACCESS_DENIED", "只能查看自己的病历");
        }
        if ("DOCTOR".equals(userRole) && !record.getDoctorId().equals(currentUserId) && !record.isShared()) {
            throw new BusinessException("ACCESS_DENIED", "没有权限查看该病历");
        }

        return record;
    }

    public MedicalRecord createRecord(MedicalRecordRequest request, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", request.getAppointmentId()));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new BusinessException("ACCESS_DENIED", "只能为自己的患者写病历");
        }

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED &&
                appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new AppointmentException("INVALID_STATUS", "预约状态不正确，无法写病历");
        }

        if (medicalRecordRepository.findByAppointmentId(request.getAppointmentId()).isPresent()) {
            throw new BusinessException("RECORD_EXISTS", "该预约已有病历记录");
        }

        MedicalRecord record = new MedicalRecord();
        record.setAppointmentId(request.getAppointmentId());
        record.setPatientId(appointment.getPatientId());
        record.setDoctorId(doctorId);
        record.setChiefComplaint(request.getChiefComplaint());
        record.setPresentIllness(request.getPresentIllness());
        record.setPastHistory(request.getPastHistory());
        record.setDiagnosis(request.getDiagnosis());
        record.setTreatment(request.getTreatment());
        record.setPrescription(request.getPrescription());
        record.setAdvice(request.getAdvice());
        record.setShared(false);
        record.prePersist();

        MedicalRecord saved = medicalRecordRepository.save(record);

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setNeedFollowUp(request.isNeedFollowUp());
        appointmentRepository.save(appointment);

        if (request.isNeedFollowUp()) {
            createFollowUp(appointment);
        }

        return saved;
    }

    public MedicalRecord updateRecord(Long id, MedicalRecordRequest request, Long doctorId) {
        MedicalRecord record = getRecordById(id, doctorId, "DOCTOR");

        if (!record.getDoctorId().equals(doctorId)) {
            throw new BusinessException("ACCESS_DENIED", "只能修改自己写的病历");
        }

        record.setChiefComplaint(request.getChiefComplaint());
        record.setPresentIllness(request.getPresentIllness());
        record.setPastHistory(request.getPastHistory());
        record.setDiagnosis(request.getDiagnosis());
        record.setTreatment(request.getTreatment());
        record.setPrescription(request.getPrescription());
        record.setAdvice(request.getAdvice());
        record.preUpdate();

        return medicalRecordRepository.save(record);
    }

    private void createFollowUp(Appointment appointment) {
        FollowUp followUp = new FollowUp();
        followUp.setAppointmentId(appointment.getId());
        followUp.setPatientId(appointment.getPatientId());
        followUp.setPatientName(appointment.getPatientName());
        followUp.setDoctorId(appointment.getDoctorId());
        followUp.setDoctorName(appointment.getDoctorName());
        followUp.setFollowUpDate(LocalDate.now().plusDays(followUpDays));
        followUp.setCompleted(false);
        followUp.prePersist();

        followUpRepository.save(followUp);
        log.info("Created follow-up for appointment {} on {}",
                appointment.getId(), followUp.getFollowUpDate());
    }

    public void shareRecord(Long recordId, boolean share, Long doctorId) {
        MedicalRecord record = getRecordById(recordId, doctorId, "DOCTOR");
        if (!record.getDoctorId().equals(doctorId)) {
            throw new BusinessException("ACCESS_DENIED", "只有主治医生可以共享病历");
        }
        record.setShared(share);
        record.preUpdate();
        medicalRecordRepository.save(record);
    }
}
