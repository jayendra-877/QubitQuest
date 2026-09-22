package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.arena.MatchmakingResponse;
import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;

public interface ArenaMatchmakingService {

    MatchmakingResponse joinQueue(
            Long userId,
            ArenaGameMode mode
    );

    void leaveQueue(
            Long userId,
            ArenaGameMode mode
    );
}
