package com.hospital.dto;

import com.hospital.entity.enums.DayOfWeek;
import com.hospital.entity.enums.TimeSlotType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScheduleRuleRequest {
    @NotNull
    private Long doctorId;
    @NotNull
    private DayOfWeek dayOfWeek;
    @NotNull
    private TimeSlotType timeSlotType;
    private String startTime;
    private String endTime;
    private Integer totalSlots;
    private Integer appointmentDuration;
}
