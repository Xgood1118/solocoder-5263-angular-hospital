package com.hospital.service;

import com.hospital.entity.Doctor;
import com.hospital.entity.Review;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ReviewRepository reviewRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId);
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
    }

    public Doctor getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor not found for user: " + userId);
        }
        return doctor;
    }

    public Doctor createDoctor(Doctor doctor) {
        doctor.prePersist();
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existing = getDoctorById(id);
        existing.setName(doctor.getName());
        existing.setTitle(doctor.getTitle());
        existing.setDepartmentId(doctor.getDepartmentId());
        existing.setDepartmentName(doctor.getDepartmentName());
        existing.setBio(doctor.getBio());
        existing.setSpecialties(doctor.getSpecialties());
        existing.setConsultationFee(doctor.getConsultationFee());
        existing.setAvatar(doctor.getAvatar());
        existing.preUpdate();
        return doctorRepository.save(existing);
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor", id);
        }
        doctorRepository.deleteById(id);
    }

    public Double getDoctorAverageRating(Long doctorId) {
        return reviewRepository.calculateAverageRatingByDoctorId(doctorId);
    }

    public List<Review> getDoctorReviews(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId);
    }
}
