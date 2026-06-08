package com.hospital.service;

import com.hospital.entity.FollowUp;
import com.hospital.exception.BusinessException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.FollowUpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final NotificationService notificationService;

    public List<FollowUp> getDoctorFollowUps(Long doctorId) {
        return followUpRepository.findByDoctorId(doctorId);
    }

    public List<FollowUp> getPendingFollowUps(Long doctorId) {
        return followUpRepository.findByDoctorIdAndCompleted(doctorId, false);
    }

    public List<FollowUp> getCompletedFollowUps(Long doctorId) {
        return followUpRepository.findByDoctorIdAndCompleted(doctorId, true);
    }

    public FollowUp getFollowUpById(Long id) {
        return followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", id));
    }

    public FollowUp completeFollowUp(Long id, Long doctorId, String notes) {
        FollowUp followUp = getFollowUpById(id);

        if (!followUp.getDoctorId().equals(doctorId)) {
            throw new BusinessException("ACCESS_DENIED", "只能处理自己的回访任务");
        }

        followUp.setCompleted(true);
        followUp.setNotes(notes);
        followUp.preUpdate();

        return followUpRepository.save(followUp);
    }

    public void processDailyFollowUps() {
        log.info("Processing daily follow-up reminders");
        LocalDate today = LocalDate.now();
        List<FollowUp> dueFollowUps = followUpRepository.findByFollowUpDateAndRemindedAtIsNull(today);

        for (FollowUp followUp : dueFollowUps) {
            try {
                notificationService.createFollowUpReminder(
                        followUp.getDoctorId(),
                        followUp.getPatientId(),
                        followUp.getPatientName()
                );
                followUp.setRemindedAt(LocalDateTime.now());
                followUpRepository.save(followUp);
                log.info("Follow-up reminder sent for patient {} to doctor {}",
                        followUp.getPatientId(), followUp.getDoctorId());
            } catch (Exception e) {
                log.error("Failed to send follow-up reminder for follow-up {}", followUp.getId(), e);
            }
        }
        log.info("Processed {} follow-up reminders", dueFollowUps.size());
    }

    public FollowUp createFollowUp(FollowUp followUp) {
        followUp.setCompleted(false);
        followUp.prePersist();
        return followUpRepository.save(followUp);
    }
}
