package com.sih.Q_Six.QubitQuest.dtos;

import java.util.List;
import java.util.Map;

public record ExecuteResponseDto(
        Map<String, Integer> counts,
        Map<String, Double> probabilities,
        boolean success,
        Double executionTimeMs,
        List<ComplexNumberDto> statevector,
        Map<String, BlochVectorDto> blochSphere
) {
}
