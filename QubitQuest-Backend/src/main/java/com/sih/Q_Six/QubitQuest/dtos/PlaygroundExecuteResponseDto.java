package com.sih.Q_Six.QubitQuest.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaygroundExecuteResponseDto {

    private Map<String, Integer> counts;

    private Map<String, Double> probabilities;

    private boolean success;

    private Double executionTimeMs;

    private Object statevector;

    private Object blochSphere;
}