package com.sih.Q_Six.QubitQuest.dtos;

import com.sih.Q_Six.QubitQuest.enums.Role;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class JwtResponseDto {
    private String accessToken;
    private Long expireIn;
    private String email;
    private String name;
    private Role role;
}
