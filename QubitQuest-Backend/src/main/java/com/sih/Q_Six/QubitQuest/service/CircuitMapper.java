package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.ExecutionRequest;

public interface CircuitMapper {
    ExecutionRequest toExecutionRequest(String circuitJson);
}
