package com.hospital.repository;

import com.hospital.entity.Review;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ReviewRepository extends AbstractJsonRepository<Review> {

    public ReviewRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "reviews.json", Review.class);
    }

    public List<Review> findByDoctorId(Long doctorId) {
        return storage.values().stream()
                .filter(r -> doctorId.equals(r.getDoctorId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<Review> findByPatientId(Long patientId) {
        return storage.values().stream()
                .filter(r -> patientId.equals(r.getPatientId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Optional<Review> findByAppointmentId(Long appointmentId) {
        return storage.values().stream()
                .filter(r -> appointmentId.equals(r.getAppointmentId()))
                .findFirst();
    }

    public Double calculateAverageRatingByDoctorId(Long doctorId) {
        List<Review> reviews = findByDoctorId(doctorId);
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
