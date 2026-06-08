package com.hospital.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Review extends BaseEntity {
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private Integer rating;
    private String comment;
    private String tags;
}
