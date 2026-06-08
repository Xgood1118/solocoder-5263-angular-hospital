package com.hospital.controller;

import com.hospital.dto.AppointmentRequest;
import com.hospital.dto.RescheduleRequest;
import com.hospital.dto.ReviewRequest;
import com.hospital.entity.Appointment;
import com.hospital.entity.MedicalRecord;
import com.hospital.entity.Notification;
import com.hospital.entity.Review;
import com.hospital.service.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    private final AppointmentService appointmentService;
    private final MedicalRecordService medicalRecordService;
    private final ReviewService reviewService;
    private final NotificationService notificationService;

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody AppointmentRequest request,
            HttpServletRequest httpRequest) {
        Long patientId = (Long) httpRequest.getAttribute("userId");
        request.setPatientId(patientId);
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }

    @GetMapping("/appointments/upcoming")
    public ResponseEntity<List<Appointment>> getUpcomingAppointments(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(appointmentService.getUpcomingAppointments(patientId));
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PostMapping("/appointments/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @PostMapping("/appointments/reschedule")
    public ResponseEntity<Appointment> rescheduleAppointment(
            @RequestBody RescheduleRequest request) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(request));
    }

    @GetMapping("/medical-records")
    public ResponseEntity<List<MedicalRecord>> getMyRecords(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(medicalRecordService.getPatientRecords(patientId, patientId, "PATIENT"));
    }

    @GetMapping("/medical-records/{id}")
    public ResponseEntity<MedicalRecord> getRecord(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(medicalRecordService.getRecordById(id, patientId, "PATIENT"));
    }

    @PostMapping("/reviews")
    public ResponseEntity<Review> createReview(
            @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {
        Long patientId = (Long) httpRequest.getAttribute("userId");
        return ResponseEntity.ok(reviewService.createReview(request, patientId));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getMyReviews(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(reviewService.getPatientReviews(patientId));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getMyNotifications(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/notifications/unread-count")
    public ResponseEntity<Long> getUnreadCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }
}
