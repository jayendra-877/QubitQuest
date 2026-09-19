package com.sih.Q_Six.QubitQuest.service.Impl;


import com.sih.Q_Six.QubitQuest.dtos.*;
import com.sih.Q_Six.QubitQuest.entity.User;
import com.sih.Q_Six.QubitQuest.enums.Role;
import com.sih.Q_Six.QubitQuest.exceptions.BadRequestException;
import com.sih.Q_Six.QubitQuest.repository.UserRepository;
import com.sih.Q_Six.QubitQuest.security.JwtTokenService;
import com.sih.Q_Six.QubitQuest.service.AuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthServiceImpl implements AuthService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtTokenService authUtil;

    @Override
    public UserResponseDto signup(UserRequestDto request) {
        userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    throw new BadRequestException(
                            "User already exists with email: "
                                    + request.getEmail()
                    );
                });

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(
                        passwordEncoder.encode(request.getPassword())
                )
                .role(Role.USER)
                .totalPoints(0L)
                .currentLevel(1L)
                .build();

        user = userRepository.save(user);

        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getTotalPoints(),
                user.getCurrentLevel()
        );
    }
}
