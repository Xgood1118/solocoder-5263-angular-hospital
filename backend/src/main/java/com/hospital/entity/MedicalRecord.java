package com.hospital.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class MedicalRecord extends BaseEntity {
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private String chiefComplaint;
    private String presentIllness;
    private String pastHistory;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String advice;
    private List<String> attachmentUrls;
    private boolean shared;
}
