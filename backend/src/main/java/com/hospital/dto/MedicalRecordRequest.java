package com.hospital.dto;

import lombok.Data;

@Data
public class MedicalRecordRequest {
    private Long appointmentId;
    private Long patientId;
    private String chiefComplaint;
    private String presentIllness;
    private String pastHistory;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String advice;
    private boolean needFollowUp;
}
