package com.hospital.dto;

import com.hospital.entity.enums.AppointmentStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private Long timeSlotId;
    private LocalDate appointmentDate;
    private String symptoms;
}
