package com.sih.Q_Six.QubitQuest.dtos.arena;

import com.sih.Q_Six.QubitQuest.enums.ArenaEventType;

public record ArenaEvent(
        ArenaEventType type,
        Long matchId,
        Object data
) {
}