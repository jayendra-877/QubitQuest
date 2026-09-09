package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.ExecutionRequest;
import com.sih.Q_Six.QubitQuest.dtos.ExecutionResult;
import com.sih.Q_Six.QubitQuest.dtos.StatevectorResponseDto;
import com.sih.Q_Six.QubitQuest.dtos.BlochSphereResponseDto;

public interface ExecutionClient {

    ExecutionResult run(ExecutionRequest request);

    StatevectorResponseDto getStatevector(ExecutionRequest request);

    BlochSphereResponseDto getBlochSphere(ExecutionRequest request);
}