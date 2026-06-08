package com.hospital.entity;

import com.hospital.entity.enums.DayOfWeek;
import com.hospital.entity.enums.TimeSlotType;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ScheduleRule extends BaseEntity {
    private Long doctorId;
    private DayOfWeek dayOfWeek;
    private TimeSlotType timeSlotType;
    private String startTime;
    private String endTime;
    private Integer totalSlots;
    private Integer appointmentDuration;
    private boolean active = true;
}
