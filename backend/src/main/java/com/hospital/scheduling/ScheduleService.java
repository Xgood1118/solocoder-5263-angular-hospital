package com.hospital.scheduling;

import com.hospital.entity.ScheduleRule;
import com.hospital.entity.TimeSlot;
import com.hospital.entity.enums.DayOfWeek;
import com.hospital.entity.enums.TimeSlotType;
import com.hospital.repository.ScheduleRuleRepository;
import com.hospital.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRuleRepository scheduleRuleRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Value("${app.scheduling.pre-generate-days:7}")
    private int preGenerateDays;

    @Value("${app.scheduling.default-morning-slots:30}")
    private int defaultMorningSlots;

    @Value("${app.scheduling.default-afternoon-slots:20}")
    private int defaultAfternoonSlots;

    public List<ScheduleRule> getScheduleRulesByDoctor(Long doctorId) {
        return scheduleRuleRepository.findByDoctorId(doctorId);
    }

    public ScheduleRule createScheduleRule(ScheduleRule rule) {
        rule.setActive(true);
        if (rule.getTotalSlots() == null) {
            rule.setTotalSlots(rule.getTimeSlotType() == TimeSlotType.MORNING
                    ? defaultMorningSlots : defaultAfternoonSlots);
        }
        if (rule.getAppointmentDuration() == null) {
            rule.setAppointmentDuration(10);
        }
        return scheduleRuleRepository.save(rule);
    }

    public void deleteScheduleRule(Long ruleId) {
        scheduleRuleRepository.deleteById(ruleId);
    }

    public List<TimeSlot> getTimeSlotsByDoctorAndDate(Long doctorId, LocalDate date) {
        return timeSlotRepository.findByDoctorIdAndDate(doctorId, date);
    }

    public List<TimeSlot> getAvailableTimeSlots(Long doctorId, LocalDate date, TimeSlotType timeSlotType) {
        return timeSlotRepository.findByDoctorIdAndDateAndTimeSlotType(doctorId, date, timeSlotType);
    }

    public void generateSlotsForDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Generating time slots from {} to {}", startDate, endDate);
        List<ScheduleRule> activeRules = scheduleRuleRepository.findByActiveTrue();

        for (ScheduleRule rule : activeRules) {
            generateSlotsForRule(rule, startDate, endDate);
        }
        log.info("Time slot generation completed");
    }

    public void generateSlotsForDoctor(Long doctorId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating time slots for doctor {} from {} to {}", doctorId, startDate, endDate);
        List<ScheduleRule> rules = scheduleRuleRepository.findByDoctorId(doctorId);

        for (ScheduleRule rule : rules) {
            if (rule.isActive()) {
                generateSlotsForRule(rule, startDate, endDate);
            }
        }
    }

    private void generateSlotsForRule(ScheduleRule rule, LocalDate startDate, LocalDate endDate) {
        DayOfWeek ruleDayOfWeek = rule.getDayOfWeek();
        LocalDate current = startDate;

        while (!current.isAfter(endDate)) {
            if (matchesDayOfWeek(current, ruleDayOfWeek)) {
                List<TimeSlot> existingSlots = timeSlotRepository
                        .findByScheduleRuleIdAndDate(rule.getId(), current);
                if (existingSlots.isEmpty()) {
                    TimeSlot slot = createTimeSlot(rule, current);
                    timeSlotRepository.save(slot);
                    log.debug("Generated time slot for doctor {} on {} {}",
                            rule.getDoctorId(), current, rule.getTimeSlotType());
                }
            }
            current = current.plusDays(1);
        }
    }

    private TimeSlot createTimeSlot(ScheduleRule rule, LocalDate date) {
        TimeSlot slot = new TimeSlot();
        slot.setDoctorId(rule.getDoctorId());
        slot.setScheduleRuleId(rule.getId());
        slot.setDate(date);
        slot.setTimeSlotType(rule.getTimeSlotType());
        slot.setStartTime(LocalTime.parse(rule.getStartTime()));
        slot.setEndTime(LocalTime.parse(rule.getEndTime()));
        slot.setTotalSlots(rule.getTotalSlots());
        slot.setRemainingSlots(rule.getTotalSlots());
        slot.setVersion(0);
        slot.setAvailable(true);
        slot.setCancelled(false);
        return slot;
    }

    private boolean matchesDayOfWeek(LocalDate date, DayOfWeek ruleDayOfWeek) {
        java.time.DayOfWeek javaDay = date.getDayOfWeek();
        return switch (ruleDayOfWeek) {
            case MONDAY -> javaDay == java.time.DayOfWeek.MONDAY;
            case TUESDAY -> javaDay == java.time.DayOfWeek.TUESDAY;
            case WEDNESDAY -> javaDay == java.time.DayOfWeek.WEDNESDAY;
            case THURSDAY -> javaDay == java.time.DayOfWeek.THURSDAY;
            case FRIDAY -> javaDay == java.time.DayOfWeek.FRIDAY;
            case SATURDAY -> javaDay == java.time.DayOfWeek.SATURDAY;
            case SUNDAY -> javaDay == java.time.DayOfWeek.SUNDAY;
        };
    }

    public void cancelDoctorSlots(Long doctorId, LocalDate startDate, LocalDate endDate, String reason) {
        log.info("Cancelling slots for doctor {} from {} to {}", doctorId, startDate, endDate);
        List<TimeSlot> slots = timeSlotRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
        for (TimeSlot slot : slots) {
            slot.setCancelled(true);
            slot.setAvailable(false);
            timeSlotRepository.save(slot);
        }
        log.info("Cancelled {} slots for doctor {}", slots.size(), doctorId);
    }

    public void preGenerateWeeklySlots() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(preGenerateDays);
        generateSlotsForDateRange(today, endDate);
    }

    public long countAvailableSlots(Long doctorId, LocalDate date, TimeSlotType timeSlotType) {
        List<TimeSlot> slots = timeSlotRepository.findByDoctorIdAndDateAndTimeSlotType(
                doctorId, date, timeSlotType);
        return slots.stream()
                .mapToInt(TimeSlot::getRemainingSlots)
                .sum();
    }
}
