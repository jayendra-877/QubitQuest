package com.sih.Q_Six.QubitQuest.service.Impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.Q_Six.QubitQuest.dtos.arena.ArenaAnswerRequest;
import com.sih.Q_Six.QubitQuest.dtos.arena.ArenaEvent;
import com.sih.Q_Six.QubitQuest.dtos.arena.ArenaQuestionDto;
import com.sih.Q_Six.QubitQuest.entity.ArenaMatch;
import com.sih.Q_Six.QubitQuest.entity.ArenaQuestion;
import com.sih.Q_Six.QubitQuest.enums.ArenaEventType;
import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;
import com.sih.Q_Six.QubitQuest.enums.ArenaMatchStatus;
import com.sih.Q_Six.QubitQuest.repository.ArenaMatchRepository;
import com.sih.Q_Six.QubitQuest.repository.ArenaQuestionRepository;
import com.sih.Q_Six.QubitQuest.security.ArenaWebSocketSender;
import com.sih.Q_Six.QubitQuest.service.ArenaGameService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ArenaGameServiceImpl
        implements ArenaGameService {

    private final ArenaMatchRepository arenaMatchRepository;
    private final ArenaQuestionRepository arenaQuestionRepository;
    private final ArenaRedisService arenaRedisService;
    private final ArenaWebSocketSender arenaWebSocketSender;
    private final TaskScheduler taskScheduler;

    private final ObjectMapper objectMapper;

    public ArenaGameServiceImpl(ArenaMatchRepository arenaMatchRepository, ArenaQuestionRepository arenaQuestionRepository, ArenaRedisService arenaRedisService, ArenaWebSocketSender arenaWebSocketSender, @Qualifier("arenaTaskScheduler") TaskScheduler taskScheduler, ObjectMapper objectMapper) {
        this.arenaMatchRepository = arenaMatchRepository;
        this.arenaQuestionRepository = arenaQuestionRepository;
        this.arenaRedisService = arenaRedisService;
        this.arenaWebSocketSender = arenaWebSocketSender;
        this.taskScheduler = taskScheduler;
        this.objectMapper = objectMapper;
    }





    @Override
    @Transactional
    public void finishMatch(Long matchId) {

        ArenaMatch match =
                arenaMatchRepository
                        .findById(matchId)
                        .orElseThrow();

        /*
         * Prevent finishing twice.
         */
        if (match.getStatus() ==
                ArenaMatchStatus.FINISHED) {

            return;
        }

        /*
         * Read final scores from Redis.
         */
        Long player1Score =
                arenaRedisService.getScore(
                        matchId,
                        match.getPlayer1Id()
                );

        Long player2Score =
                arenaRedisService.getScore(
                        matchId,
                        match.getPlayer2Id()
                );

        /*
         * Determine winner.
         */
        Long winnerId = null;

        if (player1Score > player2Score) {

            winnerId =
                    match.getPlayer1Id();

        } else if (player2Score > player1Score) {

            winnerId =
                    match.getPlayer2Id();
        }

        /*
         * Update DB.
         */
        match.setPlayer1Score(
                player1Score.intValue()
        );

        match.setPlayer2Score(
                player2Score.intValue()
        );

        match.setWinnerId(
                winnerId
        );

        match.setStatus(
                ArenaMatchStatus.FINISHED
        );

        match.setFinishedAt(
                LocalDateTime.now()
        );

        arenaMatchRepository.save(match);

        /*
         * Send result to both.
         */
        sendResult(
                match,
                player1Score,
                player2Score,
                winnerId
        );

        /*
         * Clean temporary Redis state.
         */
        arenaRedisService.cleanup(
                matchId,
                match.getPlayer1Id(),
                match.getPlayer2Id()
        );
    }

    @Override
    public void submitAnswer(
            Long userId,
            ArenaAnswerRequest request
    ) {

        /*
         * Make sure player belongs to match.
         * No DB call.
         */
        if (!arenaRedisService.isPlayerInMatch(
                request.matchId(),
                userId
        )) {

            throw new IllegalStateException(
                    "You are not part of this match"
            );
        }

        /*
         * Make sure game is running.
         */
        String status =
                arenaRedisService.getStatus(
                        request.matchId()
                );

        if (!"RUNNING".equals(status)) {
            return;
        }

        /*
         * Get player's current question index.
         */
        Long index =
                arenaRedisService.getQuestionIndex(
                        request.matchId(),
                        userId
                );

        List<String> questionIds =
                arenaRedisService.getQuestions(
                        request.matchId()
                );

        if (index >= questionIds.size()) {
            return;
        }

        /*
         * Get expected question.
         */
        Long expectedQuestionId =
                Long.parseLong(
                        questionIds.get(
                                index.intValue()
                        )
                );

        /*
         * Prevent answering old question.
         */
        if (!expectedQuestionId.equals(
                request.questionId()
        )) {
            return;
        }

        /*
         * Get correct answer directly from Redis.
         */
        String answerDataJson =
                arenaRedisService.getCorrectAnswer(
                        request.matchId(),
                        request.questionId()
                );

        if (answerDataJson == null) {
            return;
        }

        boolean correct =
                checkAnswer(
                        answerDataJson,
                        request.answer()
                );

        /*
         * WRONG
         */
        if (!correct) {

            sendToPlayer(
                    userId,
                    new ArenaEvent(
                            ArenaEventType.ANSWER_RESULT,
                            request.matchId(),
                            Map.of(
                                    "correct",
                                    false,
                                    "message",
                                    "Wrong answer. Try again."
                            )
                    )
            );

            return;
        }

        /*
         * CORRECT
         */
        arenaRedisService.incrementScore(
                request.matchId(),
                userId
        );

        arenaRedisService.moveToNextQuestion(
                request.matchId(),
                userId
        );

        Long newScore =
                arenaRedisService.getScore(
                        request.matchId(),
                        userId
                );

        sendToPlayer(
                userId,
                new ArenaEvent(
                        ArenaEventType.ANSWER_RESULT,
                        request.matchId(),
                        Map.of(
                                "correct",
                                true,
                                "score",
                                newScore
                        )
                )
        );

        /*
         * Send next question from Redis.
         */
        sendCurrentQuestion(
                request.matchId(),
                userId
        );
    }



    @Override
    public void initializeMatch(Long matchId) {

        ArenaMatch match =
                arenaMatchRepository
                        .findById(matchId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Arena match not found"
                                )
                        );

        /*
         * 1. Get 30 questions from DB
         */
        List<ArenaQuestion> questions =
                getRandomQuestions(
                        match.getMode()
                );

        /*
         * 2. Store question IDs
         *    in Redis in sequence
         */
        List<Long> questionIds =
                questions.stream()
                        .map(ArenaQuestion::getId)
                        .toList();

        arenaRedisService.setQuestions(
                matchId,
                questionIds
        );

        arenaRedisService.setQuestionData(
                matchId,
                questions
        );

        /*
         * 3. Initialize both players
         */
        arenaRedisService.initializePlayer(
                matchId,
                match.getPlayer1Id()
        );

        arenaRedisService.initializePlayer(
                matchId,
                match.getPlayer2Id()
        );

        arenaRedisService.setPlayers(
                match.getId(),
                match.getPlayer1Id(),
                match.getPlayer2Id()
        );

        /*
         * 4. Set Redis status
         */
        arenaRedisService.setStatus(
                matchId,
                "COUNTDOWN"
        );

        /*
         * 5. Notify both players
         */
        sendToPlayer(
                match.getPlayer1Id(),
                new ArenaEvent(
                        ArenaEventType.MATCH_FOUND,
                        matchId,
                        Map.of(
                                "opponentId",
                                match.getPlayer2Id()
                        )
                )
        );

        sendToPlayer(
                match.getPlayer2Id(),
                new ArenaEvent(
                        ArenaEventType.MATCH_FOUND,
                        matchId,
                        Map.of(
                                "opponentId",
                                match.getPlayer1Id()
                        )
                )
        );

        /*
         * 6. Start countdown
         */
        startCountdown(match);
    }

    private List<ArenaQuestion> getRandomQuestions(
            ArenaGameMode mode
    ) {

        List<ArenaQuestion> questions =
                arenaQuestionRepository
                        .findByModeAndActiveTrue(mode);

        Collections.shuffle(questions);

        if (questions.size() < 10) {
            throw new IllegalStateException(
                    "Not enough active Arena questions for mode "
                            + mode
            );
        }

        return questions
                .subList(0, 10);
    }

    private void startCountdown(
            ArenaMatch match
    ) {

        Long matchId = match.getId();

        for (int i = 5; i >= 1; i--) {

            int seconds = i;

            long delay =
                    (5L - i) * 1000L;

            taskScheduler.schedule(
                    () -> sendToMatch(
                            match,
                            new ArenaEvent(
                                    ArenaEventType.COUNTDOWN,
                                    matchId,
                                    Map.of(
                                            "seconds",
                                            seconds
                                    )
                            )
                    ),
                    Instant.now()
                            .plusMillis(delay)
            );
        }

        taskScheduler.schedule(
                () -> startGame(match),
                Instant.now().plusSeconds(5)
        );
    }

    private void startGame(
            ArenaMatch match
    ) {

        Long matchId = match.getId();

        match.setStatus(
                ArenaMatchStatus.RUNNING
        );

        match.setGameStartedAt(
                LocalDateTime.now()
        );

        arenaMatchRepository.save(match);

        arenaRedisService.setStatus(
                matchId,
                "RUNNING"
        );

        Instant endTime =
                Instant.now().plusSeconds(120);

        arenaRedisService.setEndTime(
                matchId,
                endTime.toString()
        );

        sendToMatch(
                match,
                new ArenaEvent(
                        ArenaEventType.GAME_STARTED,
                        matchId,
                        Map.of(
                                "durationSeconds",
                                120
                        )
                )
        );

        /*
         * Send question 1 to both players.
         */
        sendCurrentQuestion(
                matchId,
                match.getPlayer1Id()
        );

        sendCurrentQuestion(
                matchId,
                match.getPlayer2Id()
        );

        /*
         * Schedule match finish.
         */
        taskScheduler.schedule(
                () -> finishMatch(matchId),
                endTime
        );
    }

    private void sendCurrentQuestion(
            Long matchId,
            Long userId
    ) {

        Long index =
                arenaRedisService.getQuestionIndex(
                        matchId,
                        userId
                );

        List<String> questionIds =
                arenaRedisService.getQuestions(
                        matchId
                );

        if (index >= questionIds.size()) {
            return;
        }

        Long questionId =
                Long.parseLong(
                        questionIds.get(
                                index.intValue()
                        )
                );

        Map<Object, Object> cachedQuestion =
                arenaRedisService.getQuestionData(
                        matchId,
                        questionId
                );

        if (cachedQuestion == null ||
                cachedQuestion.isEmpty()) {
            return;
        }

        try {

            JsonNode questionData =
                    objectMapper.readTree(
                            cachedQuestion
                                    .get("questionData")
                                    .toString()
                    );

            ArenaQuestionDto dto =
                    new ArenaQuestionDto(
                            questionId,
                            ArenaGameMode.valueOf(
                                    cachedQuestion
                                            .get("mode")
                                            .toString()
                            ),
                            cachedQuestion
                                    .get("conceptTag")
                                    .toString(),
                            cachedQuestion
                                    .get("difficulty")
                                    .toString(),
                            questionData
                    );

            sendToPlayer(
                    userId,
                    new ArenaEvent(
                            ArenaEventType.QUESTION,
                            matchId,
                            dto
                    )
            );

        } catch (JsonProcessingException e) {

            throw new RuntimeException(
                    "Invalid cached question JSON for question "
                            + questionId,
                    e
            );
        }
    }

    private void sendToMatch(
            ArenaMatch match,
            ArenaEvent event
    ) {

        sendToPlayer(
                match.getPlayer1Id(),
                event
        );

        sendToPlayer(
                match.getPlayer2Id(),
                event
        );
    }

    private void sendToPlayer(
            Long userId,
            ArenaEvent event
    ) {

        System.out.println("================================");
        System.out.println("SENDING ARENA EVENT");
        System.out.println("userId = " + userId);
        System.out.println("event = " + event);
        System.out.println("================================");

        try {
            arenaWebSocketSender.sendToPlayer(
                    userId,
                    event
            );
        } catch (Exception e) {
            System.err.println(
                    "Failed to send WebSocket event to user "
                            + userId
            );

            e.printStackTrace();
        }
    }

    private void sendResult(
            ArenaMatch match,
            Long player1Score,
            Long player2Score,
            Long winnerId
    ) {

        int margin =
                Math.abs(
                        player1Score.intValue()
                                - player2Score.intValue()
                );

        sendToPlayer(
                match.getPlayer1Id(),
                new ArenaEvent(
                        ArenaEventType.GAME_FINISHED,
                        match.getId(),
                        createResult(
                                match.getPlayer1Id(),
                                player1Score,
                                player2Score,
                                winnerId,
                                margin
                        )
                )
        );

        sendToPlayer(
                match.getPlayer2Id(),
                new ArenaEvent(
                        ArenaEventType.GAME_FINISHED,
                        match.getId(),
                        createResult(
                                match.getPlayer2Id(),
                                player1Score,
                                player2Score,
                                winnerId,
                                margin
                        )
                )
        );
    }

    private Map<String, Object> createResult(
            Long userId,
            Long player1Score,
            Long player2Score,
            Long winnerId,
            int margin
    ) {

        String result;

        if (winnerId == null) {
            result = "DRAW";
        } else if (winnerId.equals(userId)) {
            result = "WIN";
        } else {
            result = "LOSS";
        }

        return Map.of(
                "result", result,
                "yourScore",
                winnerId != null && winnerId.equals(userId)
                        ? (winnerId.equals(userId)
                        ? (userId.equals(
                        userId
                ) ? 0 : 0)
                        : 0)
                        : 0,
                "player1Score", player1Score,
                "player2Score", player2Score,
                "winnerId",
                winnerId == null ? -1 : winnerId,
                "winningMargin", margin
        );
    }

    private boolean checkAnswer(
            String answerDataJson,
            String userAnswer
    ) {

        try {

            JsonNode answerData =
                    objectMapper.readTree(
                            answerDataJson
                    );

            String correctOption =
                    answerData
                            .get("correctOption")
                            .asText();

            return correctOption.equalsIgnoreCase(
                    userAnswer.trim()
            );

        } catch (JsonProcessingException e) {

            throw new RuntimeException(
                    "Invalid cached answer JSON",
                    e
            );
        }
    }

    private ArenaQuestionDto createQuestionDto(
            ArenaQuestion question
    ) {

        try {

            String rawJson =
                    question.getQuestionDataJson();

            System.out.println(
                    "========== RAW QUESTION JSON =========="
            );

            System.out.println(rawJson);

            JsonNode questionData =
                    objectMapper.readTree(rawJson);

            System.out.println(
                    "========== PARSED JSON =========="
            );

            System.out.println(
                    questionData.toPrettyString()
            );

            System.out.println(
                    "Node class = "
                            + questionData.getClass().getName()
            );

            System.out.println(
                    "Is object = "
                            + questionData.isObject()
            );

            System.out.println(
                    "======================================"
            );

            return new ArenaQuestionDto(
                    question.getId(),
                    question.getMode(),
                    question.getConceptTag(),
                    question.getDifficulty(),
                    questionData
            );

        } catch (JsonProcessingException e) {

            throw new RuntimeException(
                    "Invalid question JSON for question "
                            + question.getId(),
                    e
            );
        }
    }

    private boolean isPlayer(
            ArenaMatch match,
            Long userId
    ) {

        return Objects.equals(
                match.getPlayer1Id(),
                userId
        )
                ||
                Objects.equals(
                        match.getPlayer2Id(),
                        userId
                );
    }
}
