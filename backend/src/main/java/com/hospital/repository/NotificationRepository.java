package com.hospital.repository;

import com.hospital.entity.Notification;
import com.hospital.entity.enums.NotificationStatus;
import com.hospital.entity.enums.NotificationType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class NotificationRepository extends AbstractJsonRepository<Notification> {

    public NotificationRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "notifications.json", Notification.class);
    }

    public List<Notification> findByUserId(Long userId) {
        return storage.values().stream()
                .filter(n -> userId.equals(n.getUserId()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<Notification> findByUserIdAndType(Long userId, NotificationType type) {
        return storage.values().stream()
                .filter(n -> userId.equals(n.getUserId()) && type.equals(n.getType()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<Notification> findByStatus(NotificationStatus status) {
        return storage.values().stream()
                .filter(n -> status.equals(n.getStatus()))
                .collect(Collectors.toList());
    }

    public List<Notification> findPendingNotifications(LocalDateTime beforeTime) {
        return storage.values().stream()
                .filter(n -> (NotificationStatus.PENDING.equals(n.getStatus())
                        || NotificationStatus.RETRYING.equals(n.getStatus()))
                        && n.getScheduledTime() != null
                        && !n.getScheduledTime().isAfter(beforeTime))
                .collect(Collectors.toList());
    }

    public List<Notification> findFailedNotifications() {
        return storage.values().stream()
                .filter(n -> NotificationStatus.FAILED.equals(n.getStatus()))
                .collect(Collectors.toList());
    }
}
