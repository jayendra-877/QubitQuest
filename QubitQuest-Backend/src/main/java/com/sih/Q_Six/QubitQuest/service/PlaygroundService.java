package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.BlochSphereResponseDto;
import com.sih.Q_Six.QubitQuest.dtos.PlaygroundExecuteResponseDto;
import com.sih.Q_Six.QubitQuest.dtos.StatevectorResponseDto;
import com.sih.Q_Six.QubitQuest.dtos.playgroundAi.PlaygroundAiResponseDto;

public interface PlaygroundService {

    PlaygroundExecuteResponseDto execute(String circuitJson);

    StatevectorResponseDto getStatevector(String circuitJson);

    BlochSphereResponseDto getBlochSphere(String circuitJson);

    PlaygroundAiResponseDto askAi(String circuitJson, String description, String message);
}