package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.ExecutionRequest;
import com.sih.Q_Six.QubitQuest.dtos.ExecutionResult;

public interface ExecutionClient {
    ExecutionResult run(ExecutionRequest request);
}
