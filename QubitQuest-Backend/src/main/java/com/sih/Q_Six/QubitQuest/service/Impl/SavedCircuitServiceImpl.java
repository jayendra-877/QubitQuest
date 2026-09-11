package com.sih.Q_Six.QubitQuest.service.Impl;

import com.sih.Q_Six.QubitQuest.dtos.CircuitDescriptionChangeDto;
import com.sih.Q_Six.QubitQuest.dtos.CircuitNameChangeDto;
import com.sih.Q_Six.QubitQuest.dtos.SaveCircuitRequestDto;
import com.sih.Q_Six.QubitQuest.dtos.SavedCircuitResponseDto;
import com.sih.Q_Six.QubitQuest.entity.SavedCircuit;
import com.sih.Q_Six.QubitQuest.entity.User;
import com.sih.Q_Six.QubitQuest.exceptions.ResourceNotFoundException;
import com.sih.Q_Six.QubitQuest.repository.SavedCircuitRepository;
import com.sih.Q_Six.QubitQuest.repository.UserRepository;
import com.sih.Q_Six.QubitQuest.service.SavedCircuitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedCircuitServiceImpl implements SavedCircuitService {

    private final SavedCircuitRepository savedCircuitRepository;
    private final UserRepository userRepository;

    @Override
    public SavedCircuitResponseDto saveCircuit(
            SaveCircuitRequestDto request
    ) {

        Long userId=1L;
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        SavedCircuit savedCircuit = new SavedCircuit();

        savedCircuit.setUser(user);
        savedCircuit.setName(request.getName());
        savedCircuit.setCircuitJson(request.getCircuitJson());
        savedCircuit.setDescription(request.getDescription());

        SavedCircuit saved = savedCircuitRepository.save(savedCircuit);

        return toDto(saved);
    }

    @Override
    public List<SavedCircuitResponseDto> getSavedCircuits() {

        Long userId=1L;
        return savedCircuitRepository
                .findAllByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public SavedCircuitResponseDto getSavedCircuit(
            Long circuitId
    ) {

        Long userId = 1L;
        SavedCircuit circuit = savedCircuitRepository.findById(circuitId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Saved circuit not found with id: " + circuitId
                        )
                );

        // Important: user should only access their own circuit
        if (!circuit.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException(
                    "Saved circuit not found with id: " + circuitId
            );
        }

        return toDto(circuit);
    }

    @Override
    public SavedCircuitResponseDto changeCircuitName(Long id, CircuitNameChangeDto circuitNameChangeDto) {
        SavedCircuit savedCircuit = savedCircuitRepository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Circuit not found with id: "+id)
        );

        savedCircuit.setName(circuitNameChangeDto.newName());
        savedCircuitRepository.save(savedCircuit);

        return toDto(savedCircuit);
    }

    @Override
    public SavedCircuitResponseDto changeCircuitDescription(Long id, CircuitDescriptionChangeDto circuitDescriptionChangeDto) {
        SavedCircuit savedCircuit = savedCircuitRepository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Circuit not found with id: "+id)
        );

        savedCircuit.setDescription(circuitDescriptionChangeDto.newDescription());
        savedCircuitRepository.save(savedCircuit);

        return toDto(savedCircuit);
    }

    @Override
    public void deleteCircuitById(Long id) {
        SavedCircuit savedCircuit = savedCircuitRepository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Circuit not found with id: "+id)
        );

        savedCircuitRepository.deleteById(id);
    }


    private SavedCircuitResponseDto toDto(SavedCircuit circuit) {

        return new SavedCircuitResponseDto(
                circuit.getId(),
                circuit.getName(),
                circuit.getCircuitJson(),
                circuit.getDescription(),
                circuit.getCreatedAt(),
                circuit.getUpdatedAt()
        );
    }
}