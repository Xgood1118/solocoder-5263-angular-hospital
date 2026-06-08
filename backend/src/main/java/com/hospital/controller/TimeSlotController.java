package com.hospital.controller;

import com.hospital.entity.TimeSlot;
import com.hospital.entity.enums.TimeSlotType;
import com.hospital.scheduling.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/time-slots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<TimeSlot>> getTimeSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(scheduleService.getTimeSlotsByDoctorAndDate(doctorId, date));
    }

    @GetMapping("/available")
    public ResponseEntity<List<TimeSlot>> getAvailableTimeSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) TimeSlotType timeSlotType) {
        if (timeSlotType != null) {
            return ResponseEntity.ok(
                    scheduleService.getAvailableTimeSlots(doctorId, date, timeSlotType));
        }
        return ResponseEntity.ok(scheduleService.getTimeSlotsByDoctorAndDate(doctorId, date));
    }
}
