package com.hospital.repository;

import com.hospital.entity.BaseEntity;

import java.util.List;
import java.util.Optional;

public interface BaseRepository<T extends BaseEntity> {
    T save(T entity);
    List<T> saveAll(List<T> entities);
    Optional<T> findById(Long id);
    List<T> findAll();
    void deleteById(Long id);
    void delete(T entity);
    boolean existsById(Long id);
    long count();
    void flush();
}
