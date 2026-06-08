package com.hospital.scheduling;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduleGenerationTask {

    private final ScheduleService scheduleService;

    @Scheduled(cron = "0 0 2 * * ?")
    public void generateWeeklySlots() {
        log.info("Starting scheduled time slot generation");
        try {
            scheduleService.preGenerateWeeklySlots();
            log.info("Scheduled time slot generation completed successfully");
        } catch (Exception e) {
            log.error("Scheduled time slot generation failed", e);
        }
    }
}
