package com.sih.Q_Six.QubitQuest.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import com.sih.Q_Six.QubitQuest.entity.ArenaQuestion;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ArenaRedisService {

    private final StringRedisTemplate redisTemplate;


    private String questionKey(Long matchId, Long questionId) {
        return "arena:match:"
                + matchId
                + ":question:"
                + questionId;
    }

    public void setQuestionData(
            Long matchId,
            List<ArenaQuestion> questions
    ) {

        for (ArenaQuestion question : questions) {

            String key = questionKey(
                    matchId,
                    question.getId()
            );

            redisTemplate.opsForHash().putAll(
                    key,
                    Map.of(
                            "id", question.getId().toString(),
                            "mode", question.getMode().name(),
                            "conceptTag", question.getConceptTag(),
                            "difficulty", question.getDifficulty(),
                            "questionData", question.getQuestionDataJson(),
                            "answerData", question.getAnswerDataJson()
                    )
            );
        }
    }

    public Map<Object, Object> getQuestionData(
            Long matchId,
            Long questionId
    ) {

        return redisTemplate.opsForHash().entries(
                questionKey(matchId, questionId)
        );
    }

    public String getCorrectAnswer(
            Long matchId,
            Long questionId
    ) {

        Object answerData =
                redisTemplate.opsForHash().get(
                        questionKey(matchId, questionId),
                        "answerData"
                );

        return answerData == null
                ? null
                : answerData.toString();
    }

    private String playerKey(
            Long matchId,
            Long userId
    ) {
        return "arena:match:"
                + matchId
                + ":player:"
                + userId;
    }

    public void initializePlayer(
            Long matchId,
            Long userId
    ) {

        String key = playerKey(matchId, userId);

        redisTemplate.opsForHash().put(
                key,
                "score",
                "0"
        );

        redisTemplate.opsForHash().put(
                key,
                "questionIndex",
                "0"
        );
    }

    public void setStatus(
            Long matchId,
            String status
    ) {

        redisTemplate.opsForValue().set(
                "arena:match:"
                        + matchId
                        + ":status",
                status
        );
    }

    public String getStatus(Long matchId) {

        return redisTemplate.opsForValue().get(
                "arena:match:"
                        + matchId
                        + ":status"
        );
    }

    public void setEndTime(
            Long matchId,
            String endTime
    ) {

        redisTemplate.opsForValue().set(
                "arena:match:"
                        + matchId
                        + ":endsAt",
                endTime
        );
    }

    public void setQuestions(
            Long matchId,
            java.util.List<Long> questionIds
    ) {

        String key =
                "arena:match:"
                        + matchId
                        + ":questions";

        redisTemplate.delete(key);

        for (Long questionId : questionIds) {

            redisTemplate.opsForList()
                    .rightPush(
                            key,
                            questionId.toString()
                    );
        }
    }

    public java.util.List<String> getQuestions(
            Long matchId
    ) {

        return redisTemplate.opsForList()
                .range(
                        "arena:match:"
                                + matchId
                                + ":questions",
                        0,
                        -1
                );
    }

    public Long getQuestionIndex(
            Long matchId,
            Long userId
    ) {

        Object value =
                redisTemplate.opsForHash().get(
                        playerKey(matchId, userId),
                        "questionIndex"
                );

        return value == null
                ? 0L
                : Long.parseLong(value.toString());
    }

    public void moveToNextQuestion(
            Long matchId,
            Long userId
    ) {

        redisTemplate.opsForHash().increment(
                playerKey(matchId, userId),
                "questionIndex",
                1
        );
    }

    public void incrementScore(
            Long matchId,
            Long userId
    ) {

        redisTemplate.opsForHash().increment(
                playerKey(matchId, userId),
                "score",
                1
        );
    }

    public Long getScore(
            Long matchId,
            Long userId
    ) {

        Object value =
                redisTemplate.opsForHash().get(
                        playerKey(matchId, userId),
                        "score"
                );

        return value == null
                ? 0L
                : Long.parseLong(value.toString());
    }

    public void cleanup(
            Long matchId,
            Long player1Id,
            Long player2Id
    ) {

        List<String> questionIds =
                getQuestions(matchId);

        if (questionIds != null) {

            for (String questionId : questionIds) {

                redisTemplate.delete(
                        questionKey(
                                matchId,
                                Long.parseLong(questionId)
                        )
                );
            }
        }

        redisTemplate.delete(
                "arena:match:" + matchId + ":questions"
        );

        redisTemplate.delete(
                "arena:match:" + matchId + ":status"
        );

        redisTemplate.delete(
                "arena:match:" + matchId + ":endsAt"
        );

        redisTemplate.delete(
                playerKey(matchId, player1Id)
        );

        redisTemplate.delete(
                playerKey(matchId, player2Id)
        );
    }

    public void setPlayers(
            Long matchId,
            Long player1Id,
            Long player2Id
    ) {

        String key = "arena:match:" + matchId + ":players";

        redisTemplate.opsForHash().put(
                key,
                "player1",
                player1Id.toString()
        );

        redisTemplate.opsForHash().put(
                key,
                "player2",
                player2Id.toString()
        );
    }

    public boolean isPlayerInMatch(
            Long matchId,
            Long userId
    ) {

        String key = "arena:match:" + matchId + ":players";

        Object player1 =
                redisTemplate.opsForHash()
                        .get(key, "player1");

        Object player2 =
                redisTemplate.opsForHash()
                        .get(key, "player2");

        return userId.toString().equals(
                player1 != null ? player1.toString() : null
        )
                ||
                userId.toString().equals(
                        player2 != null ? player2.toString() : null
                );
    }
}