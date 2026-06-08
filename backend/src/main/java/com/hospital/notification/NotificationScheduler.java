package com.hospital.notification;

import com.hospital.service.FollowUpService;
import com.hospital.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final NotificationService notificationService;
    private final FollowUpService followUpService;

    @Scheduled(cron = "0 */5 * * * ?")
    public void sendPendingNotifications() {
        log.debug("Running notification sending task");
        try {
            notificationService.sendPendingNotifications();
        } catch (Exception e) {
            log.error("Notification sending task failed", e);
        }
    }

    @Scheduled(cron = "0 0 8 * * ?")
    public void processDailyFollowUps() {
        log.info("Running daily follow-up processing");
        try {
            followUpService.processDailyFollowUps();
        } catch (Exception e) {
            log.error("Daily follow-up processing failed", e);
        }
    }

    @Scheduled(cron = "0 0 */2 * * ?")
    public void retryFailedNotifications() {
        log.info("Running failed notification retry task");
        try {
            notificationService.retryFailedNotifications();
        } catch (Exception e) {
            log.error("Notification retry task failed", e);
        }
    }
}
