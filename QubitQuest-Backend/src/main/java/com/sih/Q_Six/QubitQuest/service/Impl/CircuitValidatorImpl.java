package com.sih.Q_Six.QubitQuest.service.Impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import com.sih.Q_Six.QubitQuest.exceptions.InvalidCircuitException;
import com.sih.Q_Six.QubitQuest.service.CircuitValidator;
import org.springframework.stereotype.Service;

import java.util.*;
@Service
public class CircuitValidatorImpl implements CircuitValidator {
    private static final Set<String> VALID_SINGLE_QUBIT_GATES =
            Set.of("X", "Y", "Z", "H", "S", "T", "RX", "RY", "RZ");

    private static final Set<String> VALID_TWO_QUBIT_GATES =
            Set.of("CNOT", "CZ", "SWAP");

    @Override
    public void validate(String circuitJson) {

        JsonNode root = parse(circuitJson);

        // Your JSON uses "qubits"
        if (!root.has("qubits")) {
            throw new InvalidCircuitException("Missing required field: qubits");
        }

        int numQubits = root.get("qubits").asInt();

        if (numQubits < 1 || numQubits > 10) {
            throw new InvalidCircuitException(
                    "qubits must be between 1 and 10"
            );
        }

        if (!root.has("gates") || !root.get("gates").isArray()) {
            throw new InvalidCircuitException(
                    "Missing or invalid gates array"
            );
        }

        for (JsonNode gate : root.get("gates")) {

            if (!gate.has("type")) {
                throw new InvalidCircuitException(
                        "Gate type is required"
                );
            }

            String type = gate.get("type").asText();

            if (VALID_SINGLE_QUBIT_GATES.contains(type)) {

                validateSingleQubitGate(gate, type, numQubits);

            } else if (VALID_TWO_QUBIT_GATES.contains(type)) {

                validateTwoQubitGate(gate, type, numQubits);

            } else {

                throw new InvalidCircuitException(
                        "Unknown gate type: " + type
                );
            }
        }
    }


    private void validateSingleQubitGate(
            JsonNode gate,
            String type,
            int numQubits
    ) {

        if (!gate.has("target")) {
            throw new InvalidCircuitException(
                    type + " requires a target qubit"
            );
        }

        int target = gate.get("target").asInt();

        validateQubitIndex(target, numQubits);

        // Rotation gates require exactly one parameter
        if (Set.of("RX", "RY", "RZ").contains(type)) {

            if (!gate.has("params")
                    || !gate.get("params").isArray()
                    || gate.get("params").size() != 1) {

                throw new InvalidCircuitException(
                        type + " requires exactly 1 parameter"
                );
            }
        }
    }


    private void validateTwoQubitGate(
            JsonNode gate,
            String type,
            int numQubits
    ) {

        if (!gate.has("control")) {
            throw new InvalidCircuitException(
                    type + " requires a control qubit"
            );
        }

        if (!gate.has("target")) {
            throw new InvalidCircuitException(
                    type + " requires a target qubit"
            );
        }

        int control = gate.get("control").asInt();
        int target = gate.get("target").asInt();

        validateQubitIndex(control, numQubits);
        validateQubitIndex(target, numQubits);

        if (control == target) {
            throw new InvalidCircuitException(
                    type + " control and target cannot be the same"
            );
        }
    }


    private void validateQubitIndex(
            int qubit,
            int numQubits
    ) {

        if (qubit < 0 || qubit >= numQubits) {

            throw new InvalidCircuitException(
                    "Qubit index out of range: " + qubit
            );
        }
    }


    @Override
    public int countGates(String circuitJson) {

        JsonNode root = parse(circuitJson);

        if (!root.has("gates") || !root.get("gates").isArray()) {
            throw new InvalidCircuitException(
                    "Missing or invalid gates array"
            );
        }

        return root.get("gates").size();
    }


    @Override
    public int computeDepth(String circuitJson) {

        JsonNode root = parse(circuitJson);

        if (!root.has("qubits")) {
            throw new InvalidCircuitException(
                    "Missing required field: qubits"
            );
        }

        int numQubits = root.get("qubits").asInt();

        int[] qubitLayer = new int[numQubits];

        for (JsonNode gate : root.get("gates")) {

            String type = gate.get("type").asText();

            if (VALID_SINGLE_QUBIT_GATES.contains(type)) {

                int target = gate.get("target").asInt();

                qubitLayer[target]++;

            } else if (VALID_TWO_QUBIT_GATES.contains(type)) {

                int control = gate.get("control").asInt();
                int target = gate.get("target").asInt();

                int maxLayer = Math.max(
                        qubitLayer[control],
                        qubitLayer[target]
                );

                qubitLayer[control] = maxLayer + 1;
                qubitLayer[target] = maxLayer + 1;
            }
        }

        return Arrays.stream(qubitLayer)
                .max()
                .orElse(0);
    }


    private JsonNode parse(String json) {

        try {

            return new ObjectMapper().readTree(json);

        } catch (Exception e) {

            throw new InvalidCircuitException(
                    "Malformed circuit JSON"
            );
        }
    }
}
