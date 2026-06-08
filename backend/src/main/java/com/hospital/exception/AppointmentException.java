package com.hospital.exception;

public class AppointmentException extends BusinessException {
    public AppointmentException(String code, String message) {
        super(code, message);
    }
}
