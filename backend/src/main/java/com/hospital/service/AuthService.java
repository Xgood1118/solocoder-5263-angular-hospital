package com.hospital.service;

import com.hospital.dto.LoginRequest;
import com.hospital.dto.LoginResponse;
import com.hospital.entity.User;
import com.hospital.entity.enums.Role;
import com.hospital.exception.BusinessException;
import com.hospital.repository.UserRepository;
import com.hospital.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("INVALID_CREDENTIALS", "用户名或密码错误"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("INVALID_CREDENTIALS", "用户名或密码错误");
        }

        if (!user.isEnabled()) {
            throw new BusinessException("ACCOUNT_DISABLED", "账户已被禁用");
        }

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toSet());

        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getUsername(),
                roleNames
        );

        return new LoginResponse(token, user.getId(), user.getUsername(), user.getName(), roleNames);
    }

    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BusinessException("USERNAME_EXISTS", "用户名已存在");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(Set.of(Role.PATIENT));
        }
        user.setEnabled(true);
        user.prePersist();

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
    }

    public User getCurrentUser(Long userId) {
        return getUserById(userId);
    }
}
