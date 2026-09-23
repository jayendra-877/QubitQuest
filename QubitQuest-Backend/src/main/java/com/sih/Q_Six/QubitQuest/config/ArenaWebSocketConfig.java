package com.sih.Q_Six.QubitQuest.config;

import com.sih.Q_Six.QubitQuest.security.ArenaWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;


@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class ArenaWebSocketConfig
        implements WebSocketConfigurer {

    private final ArenaWebSocketHandler arenaWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(
            WebSocketHandlerRegistry registry
    ) {

        registry.addHandler(
                arenaWebSocketHandler,
                "/ws/arena"
        ).setAllowedOriginPatterns("*");
    }
}