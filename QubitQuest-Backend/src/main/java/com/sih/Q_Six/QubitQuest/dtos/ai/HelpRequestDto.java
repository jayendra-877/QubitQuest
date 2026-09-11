package com.sih.Q_Six.QubitQuest.dtos.ai;

import jakarta.validation.constraints.NotBlank;

public record HelpRequestDto(
        @NotBlank(message = "Message cannot be empty")
        String userMessage
) {}
