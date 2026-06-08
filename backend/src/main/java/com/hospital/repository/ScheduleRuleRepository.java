package com.hospital.repository;

import com.hospital.entity.ScheduleRule;
import com.hospital.entity.enums.DayOfWeek;
import com.hospital.entity.enums.TimeSlotType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ScheduleRuleRepository extends AbstractJsonRepository<ScheduleRule> {

    public ScheduleRuleRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "schedule_rules.json", ScheduleRule.class);
    }

    public List<ScheduleRule> findByDoctorId(Long doctorId) {
        return storage.values().stream()
                .filter(s -> doctorId.equals(s.getDoctorId()))
                .collect(Collectors.toList());
    }

    public List<ScheduleRule> findByDoctorIdAndDayOfWeek(Long doctorId, DayOfWeek dayOfWeek) {
        return storage.values().stream()
                .filter(s -> doctorId.equals(s.getDoctorId()) && dayOfWeek.equals(s.getDayOfWeek()) && s.isActive())
                .collect(Collectors.toList());
    }

    public List<ScheduleRule> findByDoctorIdAndDayOfWeekAndTimeSlotType(Long doctorId, DayOfWeek dayOfWeek, TimeSlotType timeSlotType) {
        return storage.values().stream()
                .filter(s -> doctorId.equals(s.getDoctorId())
                        && dayOfWeek.equals(s.getDayOfWeek())
                        && timeSlotType.equals(s.getTimeSlotType())
                        && s.isActive())
                .collect(Collectors.toList());
    }

    public List<ScheduleRule> findByActiveTrue() {
        return storage.values().stream()
                .filter(ScheduleRule::isActive)
                .collect(Collectors.toList());
    }
}
