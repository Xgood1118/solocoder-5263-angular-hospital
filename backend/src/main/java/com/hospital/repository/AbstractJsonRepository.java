package com.hospital.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hospital.entity.BaseEntity;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
public abstract class AbstractJsonRepository<T extends BaseEntity> implements BaseRepository<T> {

    protected final Map<Long, T> storage = new ConcurrentHashMap<>();
    protected final AtomicLong idGenerator = new AtomicLong(0);
    protected final ObjectMapper objectMapper;
    protected final String dataFilePath;
    protected final Class<T> entityClass;

    protected AbstractJsonRepository(String dataFilePath, Class<T> entityClass) {
        this.dataFilePath = dataFilePath;
        this.entityClass = entityClass;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        loadFromFile();
    }

    @PreDestroy
    public void destroy() {
        saveToFile();
    }

    @SuppressWarnings("unchecked")
    protected void loadFromFile() {
        try {
            File file = new File(dataFilePath);
            if (file.exists() && file.length() > 0) {
                List<T> entities = objectMapper.readValue(
                    file,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, entityClass)
                );
                for (T entity : entities) {
                    storage.put(entity.getId(), entity);
                    if (entity.getId() > idGenerator.get()) {
                        idGenerator.set(entity.getId());
                    }
                }
                log.info("Loaded {} {} entities from {}", entities.size(), entityClass.getSimpleName(), dataFilePath);
            }
        } catch (IOException e) {
            log.error("Failed to load data from file: {}", dataFilePath, e);
        }
    }

    protected synchronized void saveToFile() {
        try {
            File file = new File(dataFilePath);
            File parentDir = file.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                parentDir.mkdirs();
            }
            List<T> entities = new ArrayList<>(storage.values());
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, entities);
        } catch (IOException e) {
            log.error("Failed to save data to file: {}", dataFilePath, e);
        }
    }

    @Override
    public T save(T entity) {
        if (entity.getId() == null) {
            entity.setId(idGenerator.incrementAndGet());
            entity.prePersist();
        } else {
            entity.preUpdate();
        }
        storage.put(entity.getId(), entity);
        saveToFile();
        return entity;
    }

    @Override
    public List<T> saveAll(List<T> entities) {
        List<T> saved = new ArrayList<>();
        for (T entity : entities) {
            if (entity.getId() == null) {
                entity.setId(idGenerator.incrementAndGet());
                entity.prePersist();
            } else {
                entity.preUpdate();
            }
            storage.put(entity.getId(), entity);
            saved.add(entity);
        }
        saveToFile();
        return saved;
    }

    @Override
    public Optional<T> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<T> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public void deleteById(Long id) {
        storage.remove(id);
        saveToFile();
    }

    @Override
    public void delete(T entity) {
        if (entity.getId() != null) {
            storage.remove(entity.getId());
            saveToFile();
        }
    }

    @Override
    public boolean existsById(Long id) {
        return storage.containsKey(id);
    }

    @Override
    public long count() {
        return storage.size();
    }

    @Override
    public void flush() {
        saveToFile();
    }
}
