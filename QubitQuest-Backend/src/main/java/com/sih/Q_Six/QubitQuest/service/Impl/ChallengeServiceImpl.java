package com.sih.Q_Six.QubitQuest.service.Impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.Q_Six.QubitQuest.dtos.*;
import com.sih.Q_Six.QubitQuest.entity.Challenge;
import com.sih.Q_Six.QubitQuest.entity.ChallengeAttempt;
import com.sih.Q_Six.QubitQuest.entity.ChallengeProgress;
import com.sih.Q_Six.QubitQuest.enums.ChallengeType;
import com.sih.Q_Six.QubitQuest.enums.ProgressStatus;
import com.sih.Q_Six.QubitQuest.exceptions.ChallengeNotFoundException;
import com.sih.Q_Six.QubitQuest.exceptions.ExecutionServiceException;
import com.sih.Q_Six.QubitQuest.repository.ChallengeAttemptRepository;
import com.sih.Q_Six.QubitQuest.repository.ChallengeProgressRepository;
import com.sih.Q_Six.QubitQuest.repository.ChallengeRepository;
import com.sih.Q_Six.QubitQuest.repository.MissionRepository;
import com.sih.Q_Six.QubitQuest.service.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final MissionRepository missionRepository;
    private final ChallengeProgressRepository progressRepository;
    private final ChallengeAttemptRepository attemptRepository;

    private final CircuitValidator circuitValidator;
    private final CircuitMapper circuitMapper;
    private final ExecutionClient executionClient;
    private final CorrectnessChecker correctnessChecker;
    private final ObjectMapper objectMapper;
    @Override
    public List<MissionWIthChallengesDto> getAllMissionsWithChallenges(Long userId) {
        return missionRepository.findAllByOrderByOrderNumberAsc().stream()
                .map(m -> new MissionWIthChallengesDto(
                        m.getId(), m.getTitle(), m.getDescription(),
                        m.getChallenges().stream()
                                .map(c -> toSummaryDto(c, userId))
                                .toList()
                )).toList();
    }

    @Override
    public ChallengeDetailDto getChallengeDetail(Long userId, Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge not found"));

        ChallengeProgress progress = getOrCreateProgress(userId, challengeId);
        List<String> options = parseOptionsOrNull(challenge.getPredictorOptionsJson());

        String startingCircuit = challenge.getChallengeType() == ChallengeType.DEBUG
                ? challenge.getBrokenCircuitJson()
                : challenge.getDefaultCircuitJson();

        return new ChallengeDetailDto(
                challenge.getId(), challenge.getTitle(), challenge.getStory(),
                challenge.getChallengeType(), challenge.getConceptTag(), challenge.getDifficulty(),
                startingCircuit,
                challenge.getPredictorQuestion(), options,
                challenge.getAllowCircuitEdit(),
                progress.getAttempts(), progress.getStatus()
        );

    }

    @Override
    public PredictionResultDto submitPrediction(Long userId, Long challengeId, String predictedAnswer) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge not found"));

        boolean correct = challenge.getCorrectPrediction() != null
                && challenge.getCorrectPrediction().equalsIgnoreCase(predictedAnswer.trim());

        ChallengeProgress progress = getOrCreateProgress(userId, challengeId);
        progress.incrementAttempts();  // <-- FIX: now actually counts attempts

        progress.setPredictedAnswer(predictedAnswer);
        progress.setPredictionCorrect(correct);

        String feedback;

        if (correct && progress.getStatus() != ProgressStatus.COMPLETED) {
            // FIX: mark completed and award points, same pattern as submit()
            progress.setStatus(ProgressStatus.COMPLETED);
            progress.setCompletedAt(Instant.now());
            int points = challenge.getPoints();
            progress.setBestPoints(Math.max(progress.getBestPoints(), points));
            feedback = "Good prediction! Let's see it in action.";
        } else if (correct) {
            feedback = "Correct again — already completed.";
        } else {
            if (progress.getStatus() == ProgressStatus.NOT_STARTED) {
                progress.setStatus(ProgressStatus.IN_PROGRESS);
            }
            feedback = "Not quite what happens — let's find out why.";
        }

        progressRepository.save(progress);
        return new PredictionResultDto(correct, feedback);
    }

    @Override
    public ExecuteResponseDto execute(String circuitJson) {
        circuitValidator.validate(circuitJson);
        ExecutionRequest request = circuitMapper.toExecutionRequest(circuitJson);
        ExecutionResult result = executionClient.run(request);

        if (!result.success()) {
            throw new ExecutionServiceException(
                    result.error() != null ? result.error() : "Execution failed"
            );
        }

        return new ExecuteResponseDto(
                result.counts(),
                result.probabilities(),
                true,
                result.executionTimeMs(),
                result.statevector(),
                result.blochSphere()
        );
    }

    @Override
    public SubmitResponseDto submit(Long userId, Long challengeId, String circuitJson) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge not found"));

        ExecuteResponseDto execResult = execute(circuitJson);
        boolean correct = correctnessChecker.matches(execResult.counts(), challenge.getTargetOutcomeJson());

        ChallengeProgress progress = getOrCreateProgress(userId, challengeId);
        progress.incrementAttempts();

        boolean justCompleted = false;
        int pointsAwarded = 0;
        String feedback;

        if (correct && progress.getStatus() != ProgressStatus.COMPLETED) {
            progress.setStatus(ProgressStatus.COMPLETED);
            progress.setCompletedAt(Instant.now());
            pointsAwarded = challenge.getPoints();
            progress.setBestPoints(Math.max(progress.getBestPoints(), pointsAwarded));
            justCompleted = true;
            feedback = "Correct! You created the target state.";
        } else if (correct) {
            feedback = "Correct again — already completed, no extra points this time.";
        } else {
            if (progress.getStatus() == ProgressStatus.NOT_STARTED) {
                progress.setStatus(ProgressStatus.IN_PROGRESS);
            }
            feedback = "Not quite — the measurement outcome doesn't match the target yet. Try modifying your circuit.";
        }
        progressRepository.save(progress);

        attemptRepository.save(ChallengeAttempt.builder()
                .userId(userId).challengeId(challengeId)
                .submittedCircuitJson(circuitJson)
                .resultJson(toJson(execResult.counts()))
                .correct(correct)
                .pointsAwarded(pointsAwarded)
                .gateCount(circuitValidator.countGates(circuitJson))
                .circuitDepth(circuitValidator.computeDepth(circuitJson))
                .build());

        return new SubmitResponseDto(correct, pointsAwarded, feedback, execResult, justCompleted);
    }

    // ---------- helpers ----------

    private ChallengeProgress getOrCreateProgress(Long userId, Long challengeId) {
        return progressRepository.findByUserIdAndChallengeId(userId, challengeId)
                .orElseGet(() -> {
                    ChallengeProgress p = new ChallengeProgress();
                    p.setUserId(userId);
                    p.setChallengeId(challengeId);
                    p.setStatus(ProgressStatus.NOT_STARTED);
                    p.setLastAccessedAt(Instant.now());
                    return progressRepository.save(p);
                });
    }

    private ChallengesSummaryDto toSummaryDto(Challenge c, Long userId) {
        ProgressStatus status = progressRepository.findByUserIdAndChallengeId(userId, c.getId())
                .map(ChallengeProgress::getStatus)
                .orElse(ProgressStatus.NOT_STARTED);
        return new ChallengesSummaryDto(
                c.getId(), c.getTitle(), c.getChallengeType(), c.getDifficulty(), c.getConceptTag(),
                c.getOrderNumber(), status, c.getPoints()
        );
    }

    private List<String> parseOptionsOrNull(String json) {
        if (json == null) return null;
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return null;
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}
