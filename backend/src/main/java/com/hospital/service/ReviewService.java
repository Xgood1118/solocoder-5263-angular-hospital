package com.hospital.service;

import com.hospital.dto.ReviewRequest;
import com.hospital.entity.Appointment;
import com.hospital.entity.Review;
import com.hospital.entity.enums.AppointmentStatus;
import com.hospital.exception.AppointmentException;
import com.hospital.exception.BusinessException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;

    @Value("${app.appointment.review-days-after:7}")
    private int reviewDaysAfter;

    public List<Review> getDoctorReviews(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId);
    }

    public List<Review> getPatientReviews(Long patientId) {
        return reviewRepository.findByPatientId(patientId);
    }

    public Review getReviewByAppointmentId(Long appointmentId) {
        return reviewRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found for appointment: " + appointmentId));
    }

    public Review createReview(ReviewRequest request, Long patientId) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", request.getAppointmentId()));

        if (!appointment.getPatientId().equals(patientId)) {
            throw new BusinessException("ACCESS_DENIED", "只能评价自己的预约");
        }

        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new AppointmentException("INVALID_STATUS", "只有已完成的预约可以评价");
        }

        if (!canReview(appointment)) {
            throw new AppointmentException("REVIEW_TIME_EXPIRED",
                    "就诊完成后" + reviewDaysAfter + "天内可评价");
        }

        if (reviewRepository.findByAppointmentId(request.getAppointmentId()).isPresent()) {
            throw new BusinessException("REVIEW_EXISTS", "该预约已评价");
        }

        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new BusinessException("INVALID_RATING", "评分必须在1-5之间");
        }

        Review review = new Review();
        review.setAppointmentId(request.getAppointmentId());
        review.setPatientId(patientId);
        review.setDoctorId(appointment.getDoctorId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setTags(request.getTags());
        review.prePersist();

        return reviewRepository.save(review);
    }

    public boolean canReview(Appointment appointment) {
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            return false;
        }
        LocalDate appointmentDate = appointment.getAppointmentDate();
        long daysSince = ChronoUnit.DAYS.between(appointmentDate, LocalDate.now());
        return daysSince <= reviewDaysAfter;
    }

    public Double getAverageRating(Long doctorId) {
        return reviewRepository.calculateAverageRatingByDoctorId(doctorId);
    }

    public long getReviewCount(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId).size();
    }
}
