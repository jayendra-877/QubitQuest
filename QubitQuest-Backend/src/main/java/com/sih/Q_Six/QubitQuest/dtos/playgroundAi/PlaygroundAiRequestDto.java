package com.sih.Q_Six.QubitQuest.dtos.playgroundAi;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlaygroundAiRequestDto {
    @NotBlank
    private String circuitJson;
    @NotBlank
    private String description;
    @NotBlank
    private String message;
}