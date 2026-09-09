package com.sih.Q_Six.QubitQuest.service.Impl;


import com.sih.Q_Six.QubitQuest.dtos.AuthResponse;
import com.sih.Q_Six.QubitQuest.dtos.SignupRequest;
import com.sih.Q_Six.QubitQuest.dtos.UserProfileResponse;
import com.sih.Q_Six.QubitQuest.entity.User;
import com.sih.Q_Six.QubitQuest.enums.Role;
import com.sih.Q_Six.QubitQuest.exceptions.BadRequestException;
import com.sih.Q_Six.QubitQuest.repository.UserRepository;
import com.sih.Q_Six.QubitQuest.security.AuthUtil;
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
    AuthUtil authUtil;

    @Override
    public AuthResponse signup(SignupRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new BadRequestException("User already exists with email: "+request.email());
        });

        User user = toUserEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user = userRepository.save(user);

        String token = authUtil.generateAccessToken(user);
        return new AuthResponse(token, new UserProfileResponse(user.getId(), user.getEmail(),user.getName()));
    }

    private User toUserEntity(SignupRequest request) {
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .role(Role.USER)
                .currentLevel(1L)
                .totalPoints(0L)
                .build();
        return user;
    }


}
