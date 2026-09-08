package com.sih.Q_Six.QubitQuest.dtos;

import java.util.List;

public record ExecutionRequest(
        int version,
        int numQubits,
        int numClbits,
        List<OperationRequestDto> operations
) {
}
