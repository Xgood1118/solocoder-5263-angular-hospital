package com.hospital.repository;

import com.hospital.entity.TimeSlot;
import com.hospital.entity.enums.TimeSlotType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class TimeSlotRepository extends AbstractJsonRepository<TimeSlot> {

    public TimeSlotRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "time_slots.json", TimeSlot.class);
    }

    public List<TimeSlot> findByDoctorIdAndDate(Long doctorId, LocalDate date) {
        return storage.values().stream()
                .filter(ts -> doctorId.equals(ts.getDoctorId()) && date.equals(ts.getDate()))
                .sorted((a, b) -> a.getStartTime().compareTo(b.getStartTime()))
                .collect(Collectors.toList());
    }

    public List<TimeSlot> findByDoctorIdAndDateBetween(Long doctorId, LocalDate startDate, LocalDate endDate) {
        return storage.values().stream()
                .filter(ts -> doctorId.equals(ts.getDoctorId())
                        && !ts.getDate().isBefore(startDate)
                        && !ts.getDate().isAfter(endDate))
                .sorted((a, b) -> {
                    int dateCompare = a.getDate().compareTo(b.getDate());
                    if (dateCompare != 0) return dateCompare;
                    return a.getStartTime().compareTo(b.getStartTime());
                })
                .collect(Collectors.toList());
    }

    public List<TimeSlot> findByDoctorIdAndDateAndTimeSlotType(Long doctorId, LocalDate date, TimeSlotType timeSlotType) {
        return storage.values().stream()
                .filter(ts -> doctorId.equals(ts.getDoctorId())
                        && date.equals(ts.getDate())
                        && timeSlotType.equals(ts.getTimeSlotType())
                        && ts.isAvailable()
                        && !ts.isCancelled())
                .sorted((a, b) -> a.getStartTime().compareTo(b.getStartTime()))
                .collect(Collectors.toList());
    }

    public List<TimeSlot> findByDateBetween(LocalDate startDate, LocalDate endDate) {
        return storage.values().stream()
                .filter(ts -> !ts.getDate().isBefore(startDate) && !ts.getDate().isAfter(endDate))
                .collect(Collectors.toList());
    }

    public Optional<TimeSlot> findByIdWithLock(Long id) {
        return findById(id);
    }

    public boolean decreaseRemainingSlots(Long id, Integer expectedVersion) {
        TimeSlot slot = storage.get(id);
        if (slot == null) return false;
        if (expectedVersion != null && slot.getVersion() != null
                && !slot.getVersion().equals(expectedVersion)) {
            return false;
        }
        if (slot.getRemainingSlots() <= 0) {
            return false;
        }
        slot.setRemainingSlots(slot.getRemainingSlots() - 1);
        slot.setVersion(slot.getVersion() != null ? slot.getVersion() + 1 : 1);
        slot.preUpdate();
        saveToFile();
        return true;
    }

    public boolean increaseRemainingSlots(Long id) {
        TimeSlot slot = storage.get(id);
        if (slot == null) return false;
        if (slot.getRemainingSlots() >= slot.getTotalSlots()) {
            return false;
        }
        slot.setRemainingSlots(slot.getRemainingSlots() + 1);
        slot.setVersion(slot.getVersion() != null ? slot.getVersion() + 1 : 1);
        slot.preUpdate();
        saveToFile();
        return true;
    }

    public List<TimeSlot> findByScheduleRuleIdAndDate(Long scheduleRuleId, LocalDate date) {
        return storage.values().stream()
                .filter(ts -> scheduleRuleId.equals(ts.getScheduleRuleId()) && date.equals(ts.getDate()))
                .collect(Collectors.toList());
    }
}
