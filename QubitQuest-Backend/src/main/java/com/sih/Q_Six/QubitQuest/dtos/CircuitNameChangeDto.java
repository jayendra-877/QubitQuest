package com.sih.Q_Six.QubitQuest.dtos;

import jakarta.validation.constraints.NotBlank;

public record CircuitNameChangeDto(
        @NotBlank
        String newName
) {
}
