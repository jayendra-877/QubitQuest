package com.sih.Q_Six.QubitQuest.controller;

import com.sih.Q_Six.QubitQuest.dtos.*;
import com.sih.Q_Six.QubitQuest.entity.User;
import com.sih.Q_Six.QubitQuest.security.JwtTokenService;
import com.sih.Q_Six.QubitQuest.security.UserPrincipal;
import com.sih.Q_Six.QubitQuest.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthController {

    AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> signup(
            @Valid @RequestBody UserRequestDto request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDto>loginUser(@Valid @RequestBody LoginDto loginDto){
        Authentication authentication=authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(),loginDto.getPassword()));
        UserPrincipal userPrincipal=(UserPrincipal)authentication.getPrincipal();
        User user=userPrincipal.getUser();
        String jwtAccessToken=jwtTokenService.generateAccessToken(userPrincipal,user.getRole());
        JwtResponseDto jwtResponseDto=JwtResponseDto.builder()
                .accessToken(jwtAccessToken)
                .email(user.getEmail())
                .role(user.getRole())
                .name(user.getName())
                .expireIn(7L * 24 * 60 * 60)
                .build();
        return new ResponseEntity<JwtResponseDto>(jwtResponseDto, HttpStatus.OK);
    }
}
