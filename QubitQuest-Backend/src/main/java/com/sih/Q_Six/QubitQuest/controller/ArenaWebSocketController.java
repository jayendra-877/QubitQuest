package com.sih.Q_Six.QubitQuest.controller;

import com.sih.Q_Six.QubitQuest.dtos.arena.ArenaAnswerRequest;
import com.sih.Q_Six.QubitQuest.service.ArenaGameService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ArenaWebSocketController {

    private final ArenaGameService arenaGameService;

    @MessageMapping("/arena/answer")
    public void answer(
            Principal principal,
            ArenaAnswerRequest request
    ) {

        Long userId =
                Long.parseLong(
                        principal.getName()
                );

        arenaGameService.submitAnswer(
                userId,
                request
        );
    }
}