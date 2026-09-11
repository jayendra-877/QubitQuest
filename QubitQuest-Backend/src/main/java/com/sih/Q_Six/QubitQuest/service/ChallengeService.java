package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.*;
import com.sih.Q_Six.QubitQuest.dtos.ai.HelpResponseDto;

import java.util.List;

public interface ChallengeService {

    List<MissionWIthChallengesDto> getAllMissionsWithChallenges(Long userId);

    ChallengeDetailDto getChallengeDetail(Long userId, Long challengeId);

    PredictionResultDto submitPrediction(Long userId, Long challengeId, String predictedAnswer);

    ExecuteResponseDto execute(String circuitJson);

    SubmitResponseDto submit(Long userId, Long challengeId, String circuitJson);

    HelpResponseDto askForHelp(Long challengeId, String userMessage);
}
