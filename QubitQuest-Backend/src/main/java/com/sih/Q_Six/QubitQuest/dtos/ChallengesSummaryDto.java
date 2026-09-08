package com.sih.Q_Six.QubitQuest.dtos;

import com.sih.Q_Six.QubitQuest.enums.ChallengeType;
import com.sih.Q_Six.QubitQuest.enums.Difficulty;
import com.sih.Q_Six.QubitQuest.enums.ProgressStatus;

public record ChallengesSummaryDto(
        Long id,
        String title,
        ChallengeType challengeType,
        Difficulty difficulty,
        String conceptTag,
        int orderNumber,
        ProgressStatus userStatus,
        int points
) {
}
