package com.hospital.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Department extends BaseEntity {
    private String name;
    private String code;
    private String description;
    private Long parentId;
    private Integer level;
    private Integer sortOrder;
}
