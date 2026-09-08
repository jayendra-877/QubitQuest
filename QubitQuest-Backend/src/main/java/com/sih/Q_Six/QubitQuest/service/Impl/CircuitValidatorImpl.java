package com.sih.Q_Six.QubitQuest.service.Impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import com.sih.Q_Six.QubitQuest.exceptions.InvalidCircuitException;
import com.sih.Q_Six.QubitQuest.service.CircuitValidator;
import org.springframework.stereotype.Service;

import java.util.*;
@Service
public class CircuitValidatorImpl implements CircuitValidator {
    private static final Set<String> VALID_SINGLE_QUBIT_GATES = Set.of("X", "Y", "Z", "H", "S", "T");
    private static final Set<String> VALID_TWO_QUBIT_GATES = Set.of("CNOT", "CZ", "SWAP");

    @Override
    public void validate(String circuitJson) {
        JsonNode root = parse(circuitJson);
        int numQubits = root.get("numQubits").asInt();

        if (numQubits < 1 || numQubits > 10) {
            throw new InvalidCircuitException("numQubits must be between 1 and 10");
        }

        for (JsonNode gate : root.get("gates")) {
            String type = gate.get("type").asText();
            List<Integer> qubits = toIntList(gate.get("qubits"));

            if (VALID_SINGLE_QUBIT_GATES.contains(type)) {
                if (qubits.size() != 1) throw new InvalidCircuitException(type + " requires exactly 1 qubit");
            } else if (VALID_TWO_QUBIT_GATES.contains(type)) {
                if (qubits.size() != 2) throw new InvalidCircuitException(type + " requires exactly 2 qubits");
            } else {
                throw new InvalidCircuitException("Unknown gate type: " + type);
            }

            for (int q : qubits) {
                if (q < 0 || q >= numQubits) {
                    throw new InvalidCircuitException("Qubit index out of range: " + q);
                }
            }
        }
    }

    @Override
    public int countGates(String circuitJson) {
        return parse(circuitJson).get("gates").size();
    }

    @Override
    public int computeDepth(String circuitJson) {
        JsonNode root = parse(circuitJson);
        int numQubits = root.get("numQubits").asInt();
        int[] qubitLayer = new int[numQubits];

        for (JsonNode gate : root.get("gates")) {
            List<Integer> qubits = toIntList(gate.get("qubits"));
            int maxLayer = qubits.stream().mapToInt(q -> qubitLayer[q]).max().orElse(0);
            for (int q : qubits) qubitLayer[q] = maxLayer + 1;
        }
        return Arrays.stream(qubitLayer).max().orElse(0);
    }
    private JsonNode parse(String json) {
        try {
            return new ObjectMapper().readTree(json);
        } catch (Exception e) {
            throw new InvalidCircuitException("Malformed circuit JSON");
        }
    }

    private List<Integer> toIntList(JsonNode arr) {
        List<Integer> list = new ArrayList<>();
        arr.forEach(n -> list.add(n.asInt()));
        return list;
    }
}
