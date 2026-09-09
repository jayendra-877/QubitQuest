package com.sih.Q_Six.QubitQuest.controller;

import com.sih.Q_Six.QubitQuest.dtos.SaveCircuitRequestDto;
import com.sih.Q_Six.QubitQuest.dtos.SavedCircuitResponseDto;
import com.sih.Q_Six.QubitQuest.service.SavedCircuitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/playground/circuits")
@RequiredArgsConstructor
public class SavedCircuitController {

    private final SavedCircuitService savedCircuitService;

    @PostMapping
    public SavedCircuitResponseDto saveCircuit(
            @Valid @RequestBody SaveCircuitRequestDto request
    ) {
        return savedCircuitService.saveCircuit(request);
    }

    @GetMapping
    public List<SavedCircuitResponseDto> getSavedCircuits(
    ) {
        return savedCircuitService.getSavedCircuits();
    }

    @GetMapping("/{id}")
    public SavedCircuitResponseDto getSavedCircuit(
            @PathVariable Long id
    ) {
        return savedCircuitService.getSavedCircuit(id);
    }
}