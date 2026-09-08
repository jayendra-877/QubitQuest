package com.sih.Q_Six.QubitQuest.dtos;

import java.util.List;

public record ExecutionRequest(
        int qubits,
        List<GateDto> gates,
        int shots,
        String mode
) {
}
