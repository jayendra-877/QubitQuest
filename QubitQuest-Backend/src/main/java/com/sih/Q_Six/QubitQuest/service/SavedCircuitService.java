package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.CircuitDescriptionChangeDto;
import com.sih.Q_Six.QubitQuest.dtos.CircuitNameChangeDto;
import com.sih.Q_Six.QubitQuest.dtos.SaveCircuitRequestDto;
import com.sih.Q_Six.QubitQuest.dtos.SavedCircuitResponseDto;

import java.util.List;

public interface SavedCircuitService {

    SavedCircuitResponseDto saveCircuit(
            SaveCircuitRequestDto request
    );

    List<SavedCircuitResponseDto> getSavedCircuits();

    SavedCircuitResponseDto getSavedCircuit(
            Long circuitId
    );

    SavedCircuitResponseDto changeCircuitName(Long id, CircuitNameChangeDto circuitNameChangeDto);

    SavedCircuitResponseDto changeCircuitDescription(Long id, CircuitDescriptionChangeDto circuitDescriptionChangeDto);

    void deleteCircuitById(Long id);
}