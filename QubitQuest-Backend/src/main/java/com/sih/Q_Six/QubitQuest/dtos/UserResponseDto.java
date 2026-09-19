package com.sih.Q_Six.QubitQuest.dtos;

import com.sih.Q_Six.QubitQuest.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;

    private String name;

    private String email;

    private Role role;

    private Long totalPoints;

    private Long currentLevel;
}
