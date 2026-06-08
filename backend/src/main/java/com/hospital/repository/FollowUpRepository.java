package com.hospital.repository;

import com.hospital.entity.FollowUp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class FollowUpRepository extends AbstractJsonRepository<FollowUp> {

    public FollowUpRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "follow_ups.json", FollowUp.class);
    }

    public List<FollowUp> findByDoctorId(Long doctorId) {
        return storage.values().stream()
                .filter(f -> doctorId.equals(f.getDoctorId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<FollowUp> findByPatientId(Long patientId) {
        return storage.values().stream()
                .filter(f -> patientId.equals(f.getPatientId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<FollowUp> findByDoctorIdAndCompleted(Long doctorId, boolean completed) {
        return storage.values().stream()
                .filter(f -> doctorId.equals(f.getDoctorId()) && f.isCompleted() == completed)
                .sorted((a, b) -> a.getFollowUpDate().compareTo(b.getFollowUpDate()))
                .collect(Collectors.toList());
    }

    public List<FollowUp> findByFollowUpDateAndRemindedAtIsNull(LocalDate date) {
        return storage.values().stream()
                .filter(f -> date.equals(f.getFollowUpDate())
                        && f.getRemindedAt() == null
                        && !f.isCompleted())
                .collect(Collectors.toList());
    }

    public FollowUp findByAppointmentId(Long appointmentId) {
        return storage.values().stream()
                .filter(f -> appointmentId.equals(f.getAppointmentId()))
                .findFirst()
                .orElse(null);
    }
}
