package com.sih.Q_Six.QubitQuest.dtos;

import java.util.List;

public record MissionWIthChallengesDto(
        Long id,
        String title,
        String description,
        List<ChallengesSummaryDto> challenges
) {
}
