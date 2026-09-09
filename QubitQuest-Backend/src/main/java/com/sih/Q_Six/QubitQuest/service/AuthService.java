package com.sih.Q_Six.QubitQuest.service;


import com.sih.Q_Six.QubitQuest.dtos.AuthResponse;
import com.sih.Q_Six.QubitQuest.dtos.LoginRequest;
import com.sih.Q_Six.QubitQuest.dtos.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest request);

}
