package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.arena.ArenaAnswerRequest;

public interface ArenaGameService {

    void initializeMatch(Long matchId);

    void submitAnswer(
            Long userId,
            ArenaAnswerRequest request
    );

    void finishMatch(Long matchId);
}