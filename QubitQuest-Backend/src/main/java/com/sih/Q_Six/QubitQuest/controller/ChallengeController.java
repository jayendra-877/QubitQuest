package com.sih.Q_Six.QubitQuest.controller;

import com.sih.Q_Six.QubitQuest.dtos.*;
import com.sih.Q_Six.QubitQuest.dtos.ai.HelpRequestDto;
import com.sih.Q_Six.QubitQuest.dtos.ai.HelpResponseDto;
import com.sih.Q_Six.QubitQuest.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challenges")
@RequiredArgsConstructor
public class ChallengeController {
    private final ChallengeService challengeService;

    // GET /api/challenges
    // Returns all missions with their challenges + this user's progress on each
    @GetMapping
    public List<MissionWIthChallengesDto> getAll(@RequestParam Long userId) {
        return challengeService.getAllMissionsWithChallenges(userId);
    }

    // GET /api/challenges/{id}
    // Returns full detail for one challenge (story, starting circuit, count, etc.)
    @GetMapping("/{id}")
    public ChallengeDetailDto getOne(@RequestParam Long userId, @PathVariable Long id) {
        return challengeService.getChallengeDetail(userId, id);
    }

    // POST /api/challenges/{id}/predict
    // User submits their MCQ prediction before building a circuit
    @PostMapping("/{id}/predict")
    public PredictionResultDto predict(@RequestParam Long userId, @PathVariable Long id,
                                       @Valid @RequestBody PredictionRequestDto req) {
        return challengeService.submitPrediction(userId, id, req.predictedAnswer());
    }

    // POST /api/challenges/{id}/execute
    // Runs a circuit and returns raw results — no correctness check, no points awarded
    @PostMapping("/{id}/execute")
    public ExecuteResponseDto execute(@PathVariable Long id, @Valid @RequestBody ExecuteRequestDto req) {
        return challengeService.execute(req.circuitJson());
    }

    // POST /api/challenges/{id}/submit
    // Runs a circuit, checks correctness against the target, awards points if correct
    @PostMapping("/{id}/submit")
    public SubmitResponseDto submit(@RequestParam Long userId, @PathVariable Long id,
                                    @Valid @RequestBody SubmitRequestDto req) {
        return challengeService.submit(userId, id, req.circuitJson());
    }

    // POST /challenges/{id}/help
    // User asks the AI for help on a specific challenge
    @PostMapping("/{id}/help")
    public HelpResponseDto askForHelp(@PathVariable Long id,
                                      @Valid @RequestBody HelpRequestDto req) {
        return challengeService.askForHelp(id, req.userMessage());
    }
}
