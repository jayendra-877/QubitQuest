package com.sih.Q_Six.QubitQuest.dtos.arena;

import com.fasterxml.jackson.databind.JsonNode;
import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;


public record ArenaQuestionDto(
        Long questionId,
        ArenaGameMode mode,
        String conceptTag,
        String difficulty,
        JsonNode data
) {
}