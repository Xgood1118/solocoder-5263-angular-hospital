package com.hospital.service;

import com.hospital.entity.Appointment;
import com.hospital.entity.Notification;
import com.hospital.entity.enums.NotificationStatus;
import com.hospital.entity.enums.NotificationType;
import com.hospital.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Value("${app.notification.retry-max-attempts:3}")
    private int retryMaxAttempts;

    @Value("${app.notification.remind-day-before:true}")
    private boolean remindDayBefore;

    @Value("${app.notification.remind-hour-before:1}")
    private int remindHourBefore;

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public List<Notification> getInAppNotifications(Long userId) {
        return notificationRepository.findByUserIdAndType(userId, NotificationType.IN_APP);
    }

    public void createAppointmentReminders(Appointment appointment) {
        if (remindDayBefore) {
            createDayBeforeReminder(appointment);
        }
        createHourBeforeReminder(appointment);
    }

    private void createDayBeforeReminder(Appointment appointment) {
        LocalDateTime appointmentDateTime = LocalDateTime.of(
                appointment.getAppointmentDate(), appointment.getStartTime());
        LocalDateTime remindTime = appointmentDateTime.minusDays(1)
                .withHour(9)
                .withMinute(0)
                .withSecond(0);

        if (remindTime.isAfter(LocalDateTime.now())) {
            createNotification(
                    appointment.getPatientId(),
                    "就诊前一天提醒",
                    "您好，" + appointment.getPatientName() + "，您明天 " +
                            appointment.getStartTime() + " 有一个 " +
                            appointment.getDepartmentName() + " " +
                            appointment.getDoctorName() + " 医生的预约，请准时就诊。",
                    NotificationType.SMS,
                    remindTime,
                    "APPOINTMENT",
                    appointment.getId()
            );

            createNotification(
                    appointment.getPatientId(),
                    "就诊前一天提醒",
                    "您明天 " + appointment.getStartTime() + " 有一个 " +
                            appointment.getDepartmentName() + " " +
                            appointment.getDoctorName() + " 医生的预约。",
                    NotificationType.IN_APP,
                    remindTime,
                    "APPOINTMENT",
                    appointment.getId()
            );
        }
    }

    private void createHourBeforeReminder(Appointment appointment) {
        LocalDateTime appointmentDateTime = LocalDateTime.of(
                appointment.getAppointmentDate(), appointment.getStartTime());
        LocalDateTime remindTime = appointmentDateTime.minusHours(remindHourBefore);

        if (remindTime.isAfter(LocalDateTime.now())) {
            createNotification(
                    appointment.getPatientId(),
                    "就诊前1小时提醒",
                    "您好，" + appointment.getPatientName() + "，您还有 " +
                            remindHourBefore + " 小时就到预约时间了，请前往 " +
                            appointment.getDepartmentName() + " 候诊。",
                    NotificationType.SMS,
                    remindTime,
                    "APPOINTMENT",
                    appointment.getId()
            );

            createNotification(
                    appointment.getPatientId(),
                    "就诊前1小时提醒",
                    "还有 " + remindHourBefore + " 小时就到预约时间了，请准时就诊。",
                    NotificationType.IN_APP,
                    remindTime,
                    "APPOINTMENT",
                    appointment.getId()
            );
        }
    }

    public void createCancellationNotification(Appointment appointment) {
        createNotification(
                appointment.getPatientId(),
                "预约取消成功",
                "您的预约已取消，预约号：" + appointment.getAppointmentNo() +
                        "，退款将在1-3个工作日内到账。",
                NotificationType.IN_APP,
                LocalDateTime.now(),
                "APPOINTMENT",
                appointment.getId()
        );

        createNotification(
                appointment.getPatientId(),
                "预约取消成功",
                "您的预约已取消，预约号：" + appointment.getAppointmentNo(),
                NotificationType.SMS,
                LocalDateTime.now(),
                "APPOINTMENT",
                appointment.getId()
        );
    }

    public void createRescheduleNotification(Appointment newAppointment, Appointment original) {
        createNotification(
                newAppointment.getPatientId(),
                "预约改签成功",
                "您的预约已改签，原预约时间：" + original.getAppointmentDate() + " " +
                        original.getStartTime() + "，新预约时间：" +
                        newAppointment.getAppointmentDate() + " " + newAppointment.getStartTime(),
                NotificationType.IN_APP,
                LocalDateTime.now(),
                "APPOINTMENT",
                newAppointment.getId()
        );

        createNotification(
                newAppointment.getPatientId(),
                "预约改签成功",
                "您的预约已改签，新预约号：" + newAppointment.getAppointmentNo(),
                NotificationType.SMS,
                LocalDateTime.now(),
                "APPOINTMENT",
                newAppointment.getId()
        );
    }

    public void createDoctorCancellationNotification(Long patientId, Appointment appointment, String reason) {
        createNotification(
                patientId,
                "医生停诊通知",
                "抱歉，" + appointment.getDoctorName() + " 医生因" +
                        (reason != null ? reason : "临时安排") + "停诊，" +
                        "您的预约已取消，退款将在1-3个工作日内到账。",
                NotificationType.IN_APP,
                LocalDateTime.now(),
                "APPOINTMENT",
                appointment.getId()
        );

        createNotification(
                patientId,
                "医生停诊通知",
                "抱歉，" + appointment.getDoctorName() + " 医生停诊，您的预约已取消。",
                NotificationType.SMS,
                LocalDateTime.now(),
                "APPOINTMENT",
                appointment.getId()
        );
    }

    public void createFollowUpReminder(Long doctorId, Long patientId, String patientName) {
        createNotification(
                doctorId,
                "回访提醒",
                "患者 " + patientName + " 需要回访，请及时联系。",
                NotificationType.IN_APP,
                LocalDateTime.now(),
                "FOLLOW_UP",
                patientId
        );
    }

    private Notification createNotification(Long userId, String title, String content,
                                            NotificationType type, LocalDateTime scheduledTime,
                                            String relatedType, Long relatedId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);
        notification.setStatus(NotificationStatus.PENDING);
        notification.setScheduledTime(scheduledTime);
        notification.setRetryCount(0);
        notification.setRelatedType(relatedType);
        notification.setRelatedId(relatedId);
        notification.prePersist();

        if (type == NotificationType.IN_APP) {
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentTime(LocalDateTime.now());
        }

        return notificationRepository.save(notification);
    }

    public void sendPendingNotifications() {
        List<Notification> pending = notificationRepository
                .findPendingNotifications(LocalDateTime.now());

        for (Notification notification : pending) {
            try {
                sendNotification(notification);
            } catch (Exception e) {
                handleSendFailure(notification, e);
            }
        }
    }

    private void sendNotification(Notification notification) {
        log.info("Sending notification: type={}, userId={}, title={}",
                notification.getType(), notification.getUserId(), notification.getTitle());

        if (notification.getType() == NotificationType.SMS) {
            mockSendSms(notification);
        } else if (notification.getType() == NotificationType.IN_APP) {
            // In-app notifications are already marked as sent
        } else if (notification.getType() == NotificationType.EMAIL) {
            mockSendEmail(notification);
        }

        notification.setStatus(NotificationStatus.SENT);
        notification.setSentTime(LocalDateTime.now());
        notificationRepository.save(notification);

        log.info("Notification sent successfully: id={}", notification.getId());
    }

    private void mockSendSms(Notification notification) {
        log.info("Mock SMS sent to user {}: {}", notification.getUserId(), notification.getContent());
        if (Math.random() < 0.05) {
            throw new RuntimeException("Mock SMS failure for testing");
        }
    }

    private void mockSendEmail(Notification notification) {
        log.info("Mock Email sent to user {}: {}", notification.getUserId(), notification.getContent());
    }

    private void handleSendFailure(Notification notification, Exception e) {
        log.error("Failed to send notification: id={}", notification.getId(), e);

        int retryCount = notification.getRetryCount() != null ? notification.getRetryCount() : 0;
        notification.setRetryCount(retryCount + 1);
        notification.setErrorMessage(e.getMessage());

        if (retryCount + 1 >= retryMaxAttempts) {
            notification.setStatus(NotificationStatus.FAILED);
            log.error("Notification permanently failed after {} retries: id={}",
                    retryMaxAttempts, notification.getId());
        } else {
            notification.setStatus(NotificationStatus.RETRYING);
            log.warn("Notification will be retried ({}/{}): id={}",
                    retryCount + 1, retryMaxAttempts, notification.getId());
        }

        notificationRepository.save(notification);
    }

    public void retryFailedNotifications() {
        List<Notification> failed = notificationRepository.findFailedNotifications();
        log.info("Retrying {} failed notifications", failed.size());

        for (Notification notification : failed) {
            try {
                notification.setRetryCount(0);
                notification.setStatus(NotificationStatus.RETRYING);
                notification.setErrorMessage(null);
                notificationRepository.save(notification);
                sendNotification(notification);
            } catch (Exception e) {
                handleSendFailure(notification, e);
            }
        }
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.findByUserId(userId).stream()
                .filter(n -> n.getType() == NotificationType.IN_APP)
                .filter(n -> n.getSentTime() == null ||
                        n.getSentTime().toLocalDate().equals(LocalDate.now()))
                .count();
    }
}
