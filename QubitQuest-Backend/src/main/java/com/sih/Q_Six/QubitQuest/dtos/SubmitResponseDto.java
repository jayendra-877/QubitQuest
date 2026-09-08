package com.sih.Q_Six.QubitQuest.dtos;

public record SubmitResponseDto(
        boolean correct,
        int pointsAwarded,
        String feedbackMessage,
        ExecuteResponseDto result,
        boolean challengeCompleted
) {
}
