package com.hospital.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class FollowUp extends BaseEntity {
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private LocalDate followUpDate;
    private LocalDateTime remindedAt;
    private boolean completed;
    private String notes;
}
