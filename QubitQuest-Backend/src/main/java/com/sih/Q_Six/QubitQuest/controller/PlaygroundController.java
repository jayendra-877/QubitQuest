package com.sih.Q_Six.QubitQuest.controller;

import com.sih.Q_Six.QubitQuest.dtos.*;
import com.sih.Q_Six.QubitQuest.service.PlaygroundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/playground")
@RequiredArgsConstructor
public class PlaygroundController {

    private final PlaygroundService playgroundService;


    // POST /api/playground/execute
    @PostMapping("/execute")
    public PlaygroundExecuteResponseDto execute(
            @Valid @RequestBody PlaygroundRequestDto request
    ) {

        return playgroundService.execute(
                request.getCircuitJson()
        );
    }


    // POST /api/playground/statevector
    @PostMapping("/statevector")
    public StatevectorResponseDto statevector(
            @Valid @RequestBody PlaygroundRequestDto request
    ) {

        return playgroundService.getStatevector(
                request.getCircuitJson()
        );
    }


    // POST /api/playground/bloch-sphere
    @PostMapping("/bloch-sphere")
    public BlochSphereResponseDto blochSphere(
            @Valid @RequestBody PlaygroundRequestDto request
    ) {

        return playgroundService.getBlochSphere(
                request.getCircuitJson()
        );
    }
}