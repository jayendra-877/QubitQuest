package com.sih.Q_Six.QubitQuest.service;


import com.sih.Q_Six.QubitQuest.dtos.UserRequestDto;
import com.sih.Q_Six.QubitQuest.dtos.UserResponseDto;

public interface AuthService {
    UserResponseDto signup(UserRequestDto request);

}
