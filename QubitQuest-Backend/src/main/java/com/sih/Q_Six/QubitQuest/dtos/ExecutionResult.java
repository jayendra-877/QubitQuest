package com.sih.Q_Six.QubitQuest.dtos;

import java.util.List;
import java.util.Map;

public record ExecutionResult(
        boolean success,
        String status,
        String backend,
        String framework,
        String mode,
        Integer shots,
        Map<String, Integer> counts,
        Map<String, Double> probabilities,
        List<ComplexNumberDto> statevector,
        Map<String, BlochVectorDto> blochSphere,
        ExecutionMetadataDto metadata,
        Double execution_time_ms,
        String requestId,
        String errorCode,
        String error
) {
}
