package com.hospital.controller;

import com.hospital.entity.Department;
import com.hospital.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/top-level")
    public ResponseEntity<List<Department>> getTopLevelDepartments() {
        return ResponseEntity.ok(departmentService.getTopLevelDepartments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @GetMapping("/{parentId}/sub-departments")
    public ResponseEntity<List<Department>> getSubDepartments(@PathVariable Long parentId) {
        return ResponseEntity.ok(departmentService.getSubDepartments(parentId));
    }
}
