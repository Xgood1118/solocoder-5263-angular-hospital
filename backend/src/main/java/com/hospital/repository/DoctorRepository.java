package com.hospital.repository;

import com.hospital.entity.Doctor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class DoctorRepository extends AbstractJsonRepository<Doctor> {

    public DoctorRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "doctors.json", Doctor.class);
    }

    public List<Doctor> findByDepartmentId(Long departmentId) {
        return storage.values().stream()
                .filter(d -> departmentId.equals(d.getDepartmentId()))
                .collect(Collectors.toList());
    }

    public Doctor findByUserId(Long userId) {
        return storage.values().stream()
                .filter(d -> userId.equals(d.getUserId()))
                .findFirst()
                .orElse(null);
    }
}
