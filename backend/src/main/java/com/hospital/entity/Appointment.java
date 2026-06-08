package com.hospital.entity;

import com.hospital.entity.enums.AppointmentStatus;
import com.hospital.entity.enums.TimeSlotType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class Appointment extends BaseEntity {
    private String appointmentNo;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private Long departmentId;
    private String departmentName;
    private Long timeSlotId;
    private LocalDate appointmentDate;
    private TimeSlotType timeSlotType;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer queueNumber;
    private AppointmentStatus status;
    private String symptoms;
    private boolean needFollowUp;
}
