package com.hospital.config;

import com.hospital.entity.*;
import com.hospital.entity.enums.*;
import com.hospital.repository.*;
import com.hospital.scheduling.ScheduleService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final ScheduleRuleRepository scheduleRuleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ScheduleService scheduleService;

    @PostConstruct
    public void init() {
        if (userRepository.count() > 0) {
            log.info("Data already exists, skipping initialization");
            scheduleService.preGenerateWeeklySlots();
            return;
        }

        log.info("Initializing sample data...");

        initUsers();
        initDepartments();
        initDoctors();
        initScheduleRules();
        scheduleService.preGenerateWeeklySlots();

        log.info("Sample data initialization completed");
    }

    private void initUsers() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setName("系统管理员");
        admin.setPhone("13800000000");
        admin.setEmail("admin@hospital.com");
        admin.setRoles(Set.of(Role.ADMIN));
        userRepository.save(admin);

        User doctor1 = new User();
        doctor1.setUsername("doctor1");
        doctor1.setPassword(passwordEncoder.encode("doctor123"));
        doctor1.setName("张医生");
        doctor1.setPhone("13800000001");
        doctor1.setEmail("zhang@hospital.com");
        doctor1.setRoles(Set.of(Role.DOCTOR));
        userRepository.save(doctor1);

        User doctor2 = new User();
        doctor2.setUsername("doctor2");
        doctor2.setPassword(passwordEncoder.encode("doctor123"));
        doctor2.setName("李医生");
        doctor2.setPhone("13800000002");
        doctor2.setEmail("li@hospital.com");
        doctor2.setRoles(Set.of(Role.DOCTOR));
        userRepository.save(doctor2);

        User doctor3 = new User();
        doctor3.setUsername("doctor3");
        doctor3.setPassword(passwordEncoder.encode("doctor123"));
        doctor3.setName("王医生");
        doctor3.setPhone("13800000003");
        doctor3.setEmail("wang@hospital.com");
        doctor3.setRoles(Set.of(Role.DOCTOR));
        userRepository.save(doctor3);

        User patient1 = new User();
        patient1.setUsername("patient1");
        patient1.setPassword(passwordEncoder.encode("patient123"));
        patient1.setName("患者小明");
        patient1.setPhone("13900000001");
        patient1.setEmail("patient1@example.com");
        patient1.setIdCard("110101199001011234");
        patient1.setRoles(Set.of(Role.PATIENT));
        userRepository.save(patient1);

        User patient2 = new User();
        patient2.setUsername("patient2");
        patient2.setPassword(passwordEncoder.encode("patient123"));
        patient2.setName("患者小红");
        patient2.setPhone("13900000002");
        patient2.setEmail("patient2@example.com");
        patient2.setIdCard("110101199002021234");
        patient2.setRoles(Set.of(Role.PATIENT));
        userRepository.save(patient2);

        log.info("Users initialized");
    }

    private void initDepartments() {
        Department internalMed = new Department();
        internalMed.setName("大内科");
        internalMed.setCode("INTERNAL");
        internalMed.setDescription("内科综合科室，涵盖心内、消化、神内等专业");
        internalMed.setLevel(1);
        internalMed.setSortOrder(1);
        departmentRepository.save(internalMed);

        Department surgery = new Department();
        surgery.setName("大外科");
        surgery.setCode("SURGERY");
        surgery.setDescription("外科综合科室，涵盖普外、骨外、神外等专业");
        surgery.setLevel(1);
        surgery.setSortOrder(2);
        departmentRepository.save(surgery);

        Department obstetrics = new Department();
        obstetrics.setName("妇产科");
        obstetrics.setCode("OBSTETRICS");
        obstetrics.setDescription("妇科、产科、生殖医学");
        obstetrics.setLevel(1);
        obstetrics.setSortOrder(3);
        departmentRepository.save(obstetrics);

        Department pediatrics = new Department();
        pediatrics.setName("儿科");
        pediatrics.setCode("PEDIATRICS");
        pediatrics.setDescription("儿童常见病、多发病诊治");
        pediatrics.setLevel(1);
        pediatrics.setSortOrder(4);
        departmentRepository.save(pediatrics);

        Department cardiology = new Department();
        cardiology.setName("心血管内科");
        cardiology.setCode("CARDIOLOGY");
        cardiology.setDescription("冠心病、高血压、心律失常等心血管疾病诊治");
        cardiology.setParentId(internalMed.getId());
        cardiology.setLevel(2);
        cardiology.setSortOrder(1);
        departmentRepository.save(cardiology);

        Department gastroenterology = new Department();
        gastroenterology.setName("消化内科");
        gastroenterology.setCode("GASTROENTEROLOGY");
        gastroenterology.setDescription("胃肠道、肝胆胰疾病诊治");
        gastroenterology.setParentId(internalMed.getId());
        gastroenterology.setLevel(2);
        gastroenterology.setSortOrder(2);
        departmentRepository.save(gastroenterology);

        Department neurology = new Department();
        neurology.setName("神经内科");
        neurology.setCode("NEUROLOGY");
        neurology.setDescription("脑血管病、癫痫、帕金森等神经系统疾病");
        neurology.setParentId(internalMed.getId());
        neurology.setLevel(2);
        neurology.setSortOrder(3);
        departmentRepository.save(neurology);

        Department generalSurgery = new Department();
        generalSurgery.setName("普通外科");
        generalSurgery.setCode("GENERAL_SURGERY");
        generalSurgery.setDescription("胃肠道、甲状腺、乳腺等外科疾病");
        generalSurgery.setParentId(surgery.getId());
        generalSurgery.setLevel(2);
        generalSurgery.setSortOrder(1);
        departmentRepository.save(generalSurgery);

        Department orthopedics = new Department();
        orthopedics.setName("骨科");
        orthopedics.setCode("ORTHOPEDICS");
        orthopedics.setDescription("骨折、关节疾病、脊柱疾病");
        orthopedics.setParentId(surgery.getId());
        orthopedics.setLevel(2);
        orthopedics.setSortOrder(2);
        departmentRepository.save(orthopedics);

        log.info("Departments initialized");
    }

    private void initDoctors() {
        User doctorUser1 = userRepository.findByUsername("doctor1").orElseThrow();
        User doctorUser2 = userRepository.findByUsername("doctor2").orElseThrow();
        User doctorUser3 = userRepository.findByUsername("doctor3").orElseThrow();

        Department cardiology = departmentRepository.findByCode("CARDIOLOGY");
        Department gastroenterology = departmentRepository.findByCode("GASTROENTEROLOGY");
        Department pediatrics = departmentRepository.findByCode("PEDIATRICS");

        Doctor doctor1 = new Doctor();
        doctor1.setUserId(doctorUser1.getId());
        doctor1.setName("张明");
        doctor1.setTitle("主任医师");
        doctor1.setDepartmentId(cardiology.getId());
        doctor1.setDepartmentName(cardiology.getName());
        doctor1.setBio("从事心血管临床工作20年，擅长冠心病、高血压、心力衰竭的诊治，在冠脉介入治疗方面有丰富经验。");
        doctor1.setSpecialties("冠心病,高血压,心力衰竭,冠脉介入");
        doctor1.setConsultationFee(50);
        doctorRepository.save(doctor1);

        Doctor doctor2 = new Doctor();
        doctor2.setUserId(doctorUser2.getId());
        doctor2.setName("李华");
        doctor2.setTitle("副主任医师");
        doctor2.setDepartmentId(gastroenterology.getId());
        doctor2.setDepartmentName(gastroenterology.getName());
        doctor2.setBio("消化内科专家，擅长胃肠疾病、肝病的诊断与治疗，精通胃肠镜检查及内镜下治疗。");
        doctor2.setSpecialties("胃炎,胃溃疡,肝病,胃肠镜");
        doctor2.setConsultationFee(40);
        doctorRepository.save(doctor2);

        Doctor doctor3 = new Doctor();
        doctor3.setUserId(doctorUser3.getId());
        doctor3.setName("王丽");
        doctor3.setTitle("主治医师");
        doctor3.setDepartmentId(pediatrics.getId());
        doctor3.setDepartmentName(pediatrics.getName());
        doctor3.setBio("儿科常见病、多发病的诊治，尤其擅长儿童呼吸系统疾病和过敏性疾病。");
        doctor3.setSpecialties("小儿感冒,肺炎,过敏,儿童保健");
        doctor3.setConsultationFee(30);
        doctorRepository.save(doctor3);

        log.info("Doctors initialized");
    }

    private void initScheduleRules() {
        Doctor doctor1 = doctorRepository.findByUserId(
                userRepository.findByUsername("doctor1").orElseThrow().getId());
        Doctor doctor2 = doctorRepository.findByUserId(
                userRepository.findByUsername("doctor2").orElseThrow().getId());
        Doctor doctor3 = doctorRepository.findByUserId(
                userRepository.findByUsername("doctor3").orElseThrow().getId());

        ScheduleRule rule1 = new ScheduleRule();
        rule1.setDoctorId(doctor1.getId());
        rule1.setDayOfWeek(DayOfWeek.MONDAY);
        rule1.setTimeSlotType(TimeSlotType.MORNING);
        rule1.setStartTime("08:00");
        rule1.setEndTime("12:00");
        rule1.setTotalSlots(30);
        rule1.setAppointmentDuration(8);
        scheduleRuleRepository.save(rule1);

        ScheduleRule rule2 = new ScheduleRule();
        rule2.setDoctorId(doctor1.getId());
        rule2.setDayOfWeek(DayOfWeek.WEDNESDAY);
        rule2.setTimeSlotType(TimeSlotType.MORNING);
        rule2.setStartTime("08:00");
        rule2.setEndTime("12:00");
        rule2.setTotalSlots(30);
        rule2.setAppointmentDuration(8);
        scheduleRuleRepository.save(rule2);

        ScheduleRule rule3 = new ScheduleRule();
        rule3.setDoctorId(doctor1.getId());
        rule3.setDayOfWeek(DayOfWeek.FRIDAY);
        rule3.setTimeSlotType(TimeSlotType.AFTERNOON);
        rule3.setStartTime("14:00");
        rule3.setEndTime("17:30");
        rule3.setTotalSlots(20);
        rule3.setAppointmentDuration(10);
        scheduleRuleRepository.save(rule3);

        ScheduleRule rule4 = new ScheduleRule();
        rule4.setDoctorId(doctor2.getId());
        rule4.setDayOfWeek(DayOfWeek.TUESDAY);
        rule4.setTimeSlotType(TimeSlotType.MORNING);
        rule4.setStartTime("08:00");
        rule4.setEndTime("12:00");
        rule4.setTotalSlots(25);
        rule4.setAppointmentDuration(10);
        scheduleRuleRepository.save(rule4);

        ScheduleRule rule5 = new ScheduleRule();
        rule5.setDoctorId(doctor2.getId());
        rule5.setDayOfWeek(DayOfWeek.THURSDAY);
        rule5.setTimeSlotType(TimeSlotType.AFTERNOON);
        rule5.setStartTime("14:00");
        rule5.setEndTime("17:30");
        rule5.setTotalSlots(20);
        rule5.setAppointmentDuration(10);
        scheduleRuleRepository.save(rule5);

        ScheduleRule rule6 = new ScheduleRule();
        rule6.setDoctorId(doctor3.getId());
        rule6.setDayOfWeek(DayOfWeek.MONDAY);
        rule6.setTimeSlotType(TimeSlotType.AFTERNOON);
        rule6.setStartTime("14:00");
        rule6.setEndTime("17:30");
        rule6.setTotalSlots(25);
        rule6.setAppointmentDuration(8);
        scheduleRuleRepository.save(rule6);

        ScheduleRule rule7 = new ScheduleRule();
        rule7.setDoctorId(doctor3.getId());
        rule7.setDayOfWeek(DayOfWeek.WEDNESDAY);
        rule7.setTimeSlotType(TimeSlotType.MORNING);
        rule7.setStartTime("08:00");
        rule7.setEndTime("12:00");
        rule7.setTotalSlots(30);
        rule7.setAppointmentDuration(8);
        scheduleRuleRepository.save(rule7);

        ScheduleRule rule8 = new ScheduleRule();
        rule8.setDoctorId(doctor3.getId());
        rule8.setDayOfWeek(DayOfWeek.FRIDAY);
        rule8.setTimeSlotType(TimeSlotType.MORNING);
        rule8.setStartTime("08:00");
        rule8.setEndTime("12:00");
        rule8.setTotalSlots(30);
        rule8.setAppointmentDuration(8);
        scheduleRuleRepository.save(rule8);

        log.info("Schedule rules initialized");
    }
}
