package com.sih.Q_Six.QubitQuest.dtos;

import jakarta.validation.constraints.NotBlank;

public record ExecuteRequestDto(
        @NotBlank String circuitJson
) {
}
