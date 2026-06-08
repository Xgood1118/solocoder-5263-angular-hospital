package com.hospital.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long appointmentId;
    private Integer rating;
    private String comment;
    private String tags;
}
