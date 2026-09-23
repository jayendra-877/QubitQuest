package com.sih.Q_Six.QubitQuest.dtos.arena;

public record ArenaAnswerRequest(
        Long matchId,
        Long questionId,
        String answer
) {
}