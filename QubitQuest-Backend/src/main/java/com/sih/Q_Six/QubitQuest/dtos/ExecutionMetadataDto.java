package com.sih.Q_Six.QubitQuest.dtos;

import java.util.Map;

public record ExecutionMetadataDto(
        Integer qubits,
        Integer gateCount,
        Integer depth,
        Map<String, Integer> gateCounts
) {
}
