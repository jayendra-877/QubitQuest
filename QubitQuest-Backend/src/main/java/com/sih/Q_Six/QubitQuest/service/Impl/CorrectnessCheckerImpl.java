package com.sih.Q_Six.QubitQuest.service.Impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.sih.Q_Six.QubitQuest.service.CorrectnessChecker;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CorrectnessCheckerImpl implements CorrectnessChecker {
    @Override
    public boolean matches(Map<String, Integer> actualCounts, String targetJson) {
        JsonNode target = parse(targetJson);
        double tolerance = target.has("tolerance") ? target.get("tolerance").asDouble() : 0.1;

        int totalShots = actualCounts.values().stream().mapToInt(Integer::intValue).sum();
        if (totalShots == 0) return false;

        Map<String, Double> actualProbs = new HashMap<>();
        actualCounts.forEach((k, v) -> actualProbs.put(k, v / (double) totalShots));

        Set<String> expectedKeys = new HashSet<>();
        Iterator<String> fieldNames = target.fieldNames();
        while (fieldNames.hasNext()) {
            String key = fieldNames.next();
            if (key.equals("tolerance")) continue;
            expectedKeys.add(key);

            double expectedProb = target.get(key).asDouble();
            double actualProb = actualProbs.getOrDefault(key, 0.0);

            if (Math.abs(expectedProb - actualProb) > tolerance) {
                return false;
            }
        }

        for (var entry : actualProbs.entrySet()) {
            if (!expectedKeys.contains(entry.getKey()) && entry.getValue() > tolerance) {
                return false;
            }
        }

        return true;
    }

    private JsonNode parse(String json) {
        try {
            return new ObjectMapper().readTree(json);
        } catch (Exception e) {
            throw new IllegalStateException("Malformed target_outcome_json in challenge config");
        }
    }
}
