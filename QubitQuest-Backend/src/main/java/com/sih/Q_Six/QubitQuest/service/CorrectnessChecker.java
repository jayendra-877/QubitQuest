package com.sih.Q_Six.QubitQuest.service;

import java.util.Map;

public interface CorrectnessChecker {
    boolean matches(Map<String, Integer> actualCounts, String targetJson);
}
