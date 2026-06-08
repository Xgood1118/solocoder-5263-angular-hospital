package com.hospital.service;

import com.hospital.entity.Department;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<Department> getTopLevelDepartments() {
        return departmentRepository.findByLevel(1);
    }

    public List<Department> getSubDepartments(Long parentId) {
        return departmentRepository.findByParentId(parentId);
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
    }

    public Department getDepartmentByCode(String code) {
        Department dept = departmentRepository.findByCode(code);
        if (dept == null) {
            throw new ResourceNotFoundException("Department not found with code: " + code);
        }
        return dept;
    }

    public Department createDepartment(Department department) {
        department.prePersist();
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department department) {
        Department existing = getDepartmentById(id);
        existing.setName(department.getName());
        existing.setDescription(department.getDescription());
        existing.setSortOrder(department.getSortOrder());
        existing.preUpdate();
        return departmentRepository.save(existing);
    }

    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department", id);
        }
        departmentRepository.deleteById(id);
    }

    public Department getDepartmentTree() {
        return null;
    }

    public List<Department> getDepartmentListWithChildren() {
        List<Department> topLevel = getTopLevelDepartments();
        return topLevel;
    }
}
