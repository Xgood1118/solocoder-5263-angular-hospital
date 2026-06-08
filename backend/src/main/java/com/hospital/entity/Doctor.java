package com.hospital.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Doctor extends BaseEntity {
    private Long userId;
    private String name;
    private String title;
    private Long departmentId;
    private String departmentName;
    private String bio;
    private String specialties;
    private Integer consultationFee;
    private String avatar;
}
