package com.sih.Q_Six.QubitQuest.dtos;

import com.sih.Q_Six.QubitQuest.enums.ChallengeType;
import com.sih.Q_Six.QubitQuest.enums.Difficulty;
import com.sih.Q_Six.QubitQuest.enums.ProgressStatus;

import java.util.List;

public record ChallengeDetailDto(
        Long id,
        String title,
        String story,
        ChallengeType challengeType,
        String conceptTag,
        Difficulty difficulty,
        String startingCircuitJson,
        String predictorQuestion,
        List<String> predictorOptions,
        boolean allowCircuitEdit,
        int attempts,
        ProgressStatus status
) {
}
