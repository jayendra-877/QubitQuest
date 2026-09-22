package com.sih.Q_Six.QubitQuest.controller;

import com.sih.Q_Six.QubitQuest.dtos.arena.JoinMatchmakingRequest;
import com.sih.Q_Six.QubitQuest.dtos.arena.MatchmakingResponse;
import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;
import com.sih.Q_Six.QubitQuest.security.UserPrincipal;
import com.sih.Q_Six.QubitQuest.service.ArenaMatchmakingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/arena/matchmaking")
@RequiredArgsConstructor
public class ArenaMatchmakingController {

    private final ArenaMatchmakingService matchmakingService;

    @PostMapping("/join")
    public MatchmakingResponse join(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody JoinMatchmakingRequest request
    ) {
        Long userId=userPrincipal.getUser().getId();
        return matchmakingService.joinQueue(
                userId,
                request.mode()
        );
    }

    @DeleteMapping("/leave")
    public void leave(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam ArenaGameMode mode
    ) {
        Long userId=userPrincipal.getUser().getId();
        matchmakingService.leaveQueue(
                userId,
                mode
        );
    }
}
