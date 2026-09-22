package com.sih.Q_Six.QubitQuest.dtos.arena;

import com.sih.Q_Six.QubitQuest.enums.MatchmakingStatus;

public record MatchmakingResponse(
        MatchmakingStatus status,
        Long matchId,
        String message
) {}