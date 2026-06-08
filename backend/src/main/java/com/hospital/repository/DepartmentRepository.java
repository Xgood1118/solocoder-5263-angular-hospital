package com.hospital.repository;

import com.hospital.entity.Department;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class DepartmentRepository extends AbstractJsonRepository<Department> {

    public DepartmentRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "departments.json", Department.class);
    }

    public List<Department> findByParentId(Long parentId) {
        return storage.values().stream()
                .filter(d -> parentId == null ? d.getParentId() == null : parentId.equals(d.getParentId()))
                .sorted((a, b) -> Integer.compare(
                    a.getSortOrder() != null ? a.getSortOrder() : 0,
                    b.getSortOrder() != null ? b.getSortOrder() : 0
                ))
                .collect(Collectors.toList());
    }

    public List<Department> findByLevel(Integer level) {
        return storage.values().stream()
                .filter(d -> level.equals(d.getLevel()))
                .sorted((a, b) -> Integer.compare(
                    a.getSortOrder() != null ? a.getSortOrder() : 0,
                    b.getSortOrder() != null ? b.getSortOrder() : 0
                ))
                .collect(Collectors.toList());
    }

    public Department findByCode(String code) {
        return storage.values().stream()
                .filter(d -> code.equals(d.getCode()))
                .findFirst()
                .orElse(null);
    }
}
