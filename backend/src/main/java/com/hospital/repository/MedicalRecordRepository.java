package com.hospital.repository;

import com.hospital.entity.MedicalRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class MedicalRecordRepository extends AbstractJsonRepository<MedicalRecord> {

    public MedicalRecordRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "medical_records.json", MedicalRecord.class);
    }

    public List<MedicalRecord> findByPatientId(Long patientId) {
        return storage.values().stream()
                .filter(r -> patientId.equals(r.getPatientId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<MedicalRecord> findByDoctorId(Long doctorId) {
        return storage.values().stream()
                .filter(r -> doctorId.equals(r.getDoctorId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Optional<MedicalRecord> findByAppointmentId(Long appointmentId) {
        return storage.values().stream()
                .filter(r -> appointmentId.equals(r.getAppointmentId()))
                .findFirst();
    }

    public List<MedicalRecord> findByPatientIdAndDoctorId(Long patientId, Long doctorId) {
        return storage.values().stream()
                .filter(r -> patientId.equals(r.getPatientId()) && doctorId.equals(r.getDoctorId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
