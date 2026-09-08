package com.sih.Q_Six.QubitQuest.dtos;

import java.util.List;
import java.util.Map;

public record ExecutionResult(
        boolean success,
        String status,
        String backend,
        String framework,
        Integer shots,
        Map<String, Integer> counts,
        Map<String, Double> probabilities,
        List<ComplexNumberDto> statevector,
        Map<String, BlochVectorDto> blochSphere,
        ExecutionMetadataDto metadata,
        Double executionTimeMs,
        String requestId,
        String errorCode,
        String error
) {
}
