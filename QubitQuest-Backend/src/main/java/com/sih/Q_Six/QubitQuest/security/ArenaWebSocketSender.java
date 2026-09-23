package com.sih.Q_Six.QubitQuest.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ArenaWebSocketSender {

    private final ObjectMapper objectMapper;

    private final Map<Long, WebSocketSession> sessions =
            new ConcurrentHashMap<>();

    public ArenaWebSocketSender(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void register(Long userId, WebSocketSession session) {
        sessions.put(userId, session);
    }

    public void remove(Long userId, WebSocketSession session) {
        sessions.remove(userId, session);
    }

    public void sendToPlayer(Long userId, Object event) throws Exception {

        WebSocketSession session = sessions.get(userId);

        if (session == null || !session.isOpen()) {
            System.out.println(
                    "No open WebSocket session for user " + userId
            );
            return;
        }

        String json = objectMapper.writeValueAsString(event);

        synchronized (session) {
            session.sendMessage(new TextMessage(json));
        }
    }
}
