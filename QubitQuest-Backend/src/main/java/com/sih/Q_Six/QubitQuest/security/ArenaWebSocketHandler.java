
package com.sih.Q_Six.QubitQuest.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.Q_Six.QubitQuest.dtos.arena.ArenaAnswerRequest;
import com.sih.Q_Six.QubitQuest.service.ArenaGameService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class ArenaWebSocketHandler extends TextWebSocketHandler {

    private final JwtTokenService jwtTokenService;
    private final MyUserDetailService userDetailService;
    private final ObjectMapper objectMapper;
    private final ArenaGameService arenaGameService;
    private final ArenaWebSocketSender webSocketSender;

    private final Map<Long, WebSocketSession> sessions =
            new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(
            WebSocketSession session
    ) {

        System.out.println(
                "WebSocket connected: " + session.getId()
        );
    }

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message
    ) throws Exception {

        JsonNode json =
                objectMapper.readTree(message.getPayload());

        JsonNode typeNode = json.get("type");

        if (typeNode == null) {
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        String type = typeNode.asText();

        // =========================
        // AUTH
        // =========================

        if ("AUTH".equals(type)) {

            JsonNode tokenNode = json.get("token");

            if (tokenNode == null ||
                    tokenNode.asText().isBlank()) {

                session.close(
                        CloseStatus.POLICY_VIOLATION
                );

                return;
            }

            String token = tokenNode.asText();

            String email =
                    jwtTokenService.extractEmail(token);

            UserPrincipal user =
                    (UserPrincipal)
                            userDetailService
                                    .loadUserByUsername(email);

            if (!jwtTokenService.isTokenValid(
                    token,
                    user
            )) {

                session.close(
                        CloseStatus.POLICY_VIOLATION
                );

                return;
            }

            Long userId =
                    user.getUser().getId();

            session.getAttributes()
                    .put("userId", userId);

            webSocketSender.register(userId, session);

            System.out.println(
                    "ARENA AUTHENTICATED userId = "
                            + userId
            );

            return;
        }

        // =========================
        // ANSWER
        // =========================

        if ("ANSWER".equals(type)) {

            Object userIdObject =
                    session.getAttributes()
                            .get("userId");

            if (!(userIdObject instanceof Long userId)) {

                session.close(
                        CloseStatus.POLICY_VIOLATION
                );

                return;
            }

            JsonNode matchIdNode =
                    json.get("matchId");

            JsonNode questionIdNode =
                    json.get("questionId");

            JsonNode answerNode =
                    json.get("answer");

            if (matchIdNode == null ||
                    questionIdNode == null ||
                    answerNode == null) {

                session.close(
                        CloseStatus.BAD_DATA
                );

                return;
            }

            ArenaAnswerRequest request =
                    new ArenaAnswerRequest(
                            matchIdNode.asLong(),
                            questionIdNode.asLong(),
                            answerNode.asText()
                    );

            System.out.println(
                    "ANSWER RECEIVED"
                            + " | userId=" + userId
                            + " | matchId=" + request.matchId()
                            + " | questionId=" + request.questionId()
                            + " | answer=" + request.answer()
            );

            arenaGameService.submitAnswer(
                    userId,
                    request
            );

            return;
        }

        System.out.println(
                "Unknown WebSocket message type: "
                        + type
        );
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status
    ) {

        Object userId =
                session.getAttributes()
                        .get("userId");

        if (userId instanceof Long id) {

            webSocketSender.remove(id, session);
        }

        System.out.println(
                "WebSocket closed: "
                        + session.getId()
        );
    }

    public void sendToPlayer(
            Long userId,
            Object event
    ) throws Exception {

        WebSocketSession session =
                sessions.get(userId);

        if (session == null ||
                !session.isOpen()) {

            System.out.println(
                    "No open WebSocket session for user "
                            + userId
            );

            return;
        }

        String json =
                objectMapper.writeValueAsString(event);

        synchronized (session) {

            session.sendMessage(
                    new TextMessage(json)
            );
        }
    }
}