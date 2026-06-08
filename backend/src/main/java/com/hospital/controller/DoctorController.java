package com.hospital.controller;

import com.hospital.dto.MedicalRecordRequest;
import com.hospital.entity.Appointment;
import com.hospital.entity.FollowUp;
import com.hospital.entity.MedicalRecord;
import com.hospital.entity.ScheduleRule;
import com.hospital.entity.enums.AppointmentStatus;
import com.hospital.scheduling.ScheduleService;
import com.hospital.service.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/doctor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    private final AppointmentService appointmentService;
    private final MedicalRecordService medicalRecordService;
    private final FollowUpService followUpService;
    private final DoctorService doctorService;
    private final ScheduleService scheduleService;
    private final NotificationService notificationService;

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(
            HttpServletRequest request,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long doctorUserId = (Long) request.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);

        if (date != null) {
            return ResponseEntity.ok(appointmentService.getDoctorAppointmentsByDate(doctor.getId(), date));
        }
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctor.getId()));
    }

    @GetMapping("/appointments/today")
    public ResponseEntity<List<Appointment>> getTodayAppointments(HttpServletRequest request) {
        Long doctorUserId = (Long) request.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);
        return ResponseEntity.ok(appointmentService.getTodayDoctorAppointments(doctor.getId()));
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PostMapping("/appointments/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }

    @PostMapping("/medical-records")
    public ResponseEntity<MedicalRecord> createMedicalRecord(
            @RequestBody MedicalRecordRequest request,
            HttpServletRequest httpRequest) {
        Long doctorUserId = (Long) httpRequest.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);
        return ResponseEntity.ok(medicalRecordService.createRecord(request, doctor.getId()));
    }

    @GetMapping("/medical-records")
    public ResponseEntity<List<MedicalRecord>> getMyRecords(HttpServletRequest request) {
        Long doctorUserId = (Long) request.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);
        return ResponseEntity.ok(medicalRecordService.getDoctorRecords(doctor.getId(), doctor.getId(), "DOCTOR"));
    }

    @GetMapping("/medical-records/{id}")
    public ResponseEntity<MedicalRecord> getRecord(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long doctorUserId = (Long) request.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);
        return ResponseEntity.ok(medicalRecordService.getRecordById(id, doctor.getId(), "DOCTOR"));
    }

    @PutMapping("/medical-records/{id}")
    public ResponseEntity<MedicalRecord> updateRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecordRequest request,
            HttpServletRequest httpRequest) {
        Long doctorUserId = (Long) httpRequest.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);
        return ResponseEntity.ok(medicalRecordService.updateRecord(id, request, doctor.getId()));
    }

    @GetMapping("/follow-ups")
    public ResponseEntity<List<FollowUp>> getMyFollowUps(
            HttpServletRequest request,
            @RequestParam(required = false, defaultValue = "false") boolean completed) {
        Long doctorUserId = (Long) request.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);

        if (completed) {
            return ResponseEntity.ok(followUpService.getCompletedFollowUps(doctor.getId()));
        }
        return ResponseEntity.ok(followUpService.getPendingFollowUps(doctor.getId()));
    }

    @PostMapping("/follow-ups/{id}/complete")
    public ResponseEntity<FollowUp> completeFollowUp(
            @PathVariable Long id,
            @RequestParam(required = false) String notes,
            HttpServletRequest request) {
        Long doctorUserId = (Long) request.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);
        return ResponseEntity.ok(followUpService.completeFollowUp(id, doctor.getId(), notes));
    }

    @GetMapping("/schedule-rules")
    public ResponseEntity<List<ScheduleRule>> getMyScheduleRules(HttpServletRequest request) {
        Long doctorUserId = (Long) request.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);
        return ResponseEntity.ok(scheduleService.getScheduleRulesByDoctor(doctor.getId()));
    }

    @PostMapping("/cancel-slots")
    public ResponseEntity<Void> cancelSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {
        Long doctorUserId = (Long) request.getAttribute("userId");
        var doctor = doctorService.getDoctorByUserId(doctorUserId);

        scheduleService.cancelDoctorSlots(doctor.getId(), startDate, endDate, reason);

        List<Appointment> appointments = appointmentService.getDoctorAppointments(doctor.getId());
        for (Appointment apt : appointments) {
            if (!apt.getAppointmentDate().isBefore(startDate)
                    && !apt.getAppointmentDate().isAfter(endDate)
                    && apt.getStatus() == AppointmentStatus.CONFIRMED) {
                try {
                    appointmentService.cancelAppointment(apt.getId());
                    notificationService.createDoctorCancellationNotification(
                            apt.getPatientId(), apt, reason);
                } catch (Exception e) {
                    log.error("Failed to cancel appointment {} for doctor cancellation", apt.getId(), e);
                }
            }
        }

        return ResponseEntity.ok().build();
    }
}
