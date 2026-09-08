package com.sih.Q_Six.QubitQuest.service;

public interface CircuitValidator {
    void validate(String circuitJson);
    int countGates(String circuitJson);
    int computeDepth(String circuitJson);
}
