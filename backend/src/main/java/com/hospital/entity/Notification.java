package com.hospital.entity;

import com.hospital.entity.enums.NotificationStatus;
import com.hospital.entity.enums.NotificationType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class Notification extends BaseEntity {
    private Long userId;
    private String title;
    private String content;
    private NotificationType type;
    private NotificationStatus status;
    private LocalDateTime scheduledTime;
    private LocalDateTime sentTime;
    private Integer retryCount;
    private String errorMessage;
    private String relatedType;
    private Long relatedId;
}
