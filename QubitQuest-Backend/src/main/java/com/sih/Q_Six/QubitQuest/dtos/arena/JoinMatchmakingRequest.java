package com.sih.Q_Six.QubitQuest.dtos.arena;

import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;

public record JoinMatchmakingRequest(
        ArenaGameMode mode
) {}