package com.sih.Q_Six.QubitQuest.dtos;

public record AuthResponse(
        String token,
        UserProfileResponse user
) {

}
