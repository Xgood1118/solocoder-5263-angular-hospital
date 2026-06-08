package com.hospital.repository;

import com.hospital.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepository extends AbstractJsonRepository<User> {

    public UserRepository(@Value("${app.data.storage-path}") String dataPath) {
        super(dataPath + "users.json", User.class);
    }

    public Optional<User> findByUsername(String username) {
        return storage.values().stream()
                .filter(u -> username.equals(u.getUsername()))
                .findFirst();
    }

    public Optional<User> findByPhone(String phone) {
        return storage.values().stream()
                .filter(u -> phone.equals(u.getPhone()))
                .findFirst();
    }

    public boolean existsByUsername(String username) {
        return storage.values().stream()
                .anyMatch(u -> username.equals(u.getUsername()));
    }
}
