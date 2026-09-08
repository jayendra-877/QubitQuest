package com.sih.Q_Six.QubitQuest.dtos;

import jakarta.validation.constraints.NotBlank;

public record PredictionRequestDto(@NotBlank String predictedAnswer
) {
}
