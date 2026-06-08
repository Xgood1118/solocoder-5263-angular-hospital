package com.hospital.dto;

import lombok.Data;

@Data
public class RescheduleRequest {
    private Long originalAppointmentId;
    private Long newTimeSlotId;
}
