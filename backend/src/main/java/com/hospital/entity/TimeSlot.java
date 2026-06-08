package com.hospital.entity;

import com.hospital.entity.enums.TimeSlotType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class TimeSlot extends BaseEntity {
    private Long doctorId;
    private Long scheduleRuleId;
    private LocalDate date;
    private TimeSlotType timeSlotType;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer totalSlots;
    private Integer remainingSlots;
    private Integer version;
    private boolean available = true;
    private boolean cancelled = false;
}
