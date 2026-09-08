package com.sih.Q_Six.QubitQuest.dtos;

import java.util.Map;

public record ExecutionMetadataDto(
        int qubits,
        int gateCount,
        int depth,
        Map<String, Integer> gateCounts
) {
}
