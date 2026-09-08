package com.sih.Q_Six.QubitQuest.service.Impl;

import com.sih.Q_Six.QubitQuest.dtos.ExecutionRequest;
import com.sih.Q_Six.QubitQuest.dtos.OperationRequestDto;
import com.sih.Q_Six.QubitQuest.exceptions.InvalidCircuitException;
import com.sih.Q_Six.QubitQuest.service.CircuitMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class CircuitMapperImpl implements CircuitMapper {
    private static final Set<String> CONTROLLED_GATES = Set.of("CNOT", "CZ");
    @Override
    public ExecutionRequest toExecutionRequest(String circuitJson) {
        try {
            JsonNode root = new ObjectMapper().readTree(circuitJson);
            int numQubits = root.get("numQubits").asInt();

            List<OperationRequestDto> operations = new ArrayList<>();

            for (JsonNode gateNode : root.get("gates")) {
                String type = gateNode.get("type").asText();
                List<Integer> qubits = new ArrayList<>();
                gateNode.get("qubits").forEach(q -> qubits.add(q.asInt()));

                if (CONTROLLED_GATES.contains(type)) {
                    int control = qubits.get(0);
                    int target = qubits.get(1);
                    operations.add(new OperationRequestDto(
                            "GATE", type, List.of(target), List.of(control), Map.of()
                    ));
                } else if (type.equals("SWAP")) {
                    operations.add(new OperationRequestDto(
                            "GATE", type, qubits, List.of(), Map.of()
                    ));
                } else {
                    operations.add(new OperationRequestDto(
                            "GATE", type, qubits, List.of(), Map.of()
                    ));
                }
            }

            List<Integer> allQubits = new ArrayList<>();
            for (int i = 0; i < numQubits; i++) allQubits.add(i);
            operations.add(new OperationRequestDto("MEASURE", null, allQubits, List.of(), Map.of()));

            return new ExecutionRequest(1, numQubits, numQubits, operations);

        } catch (Exception e) {
            throw new InvalidCircuitException("Could not parse circuit JSON");
        }
    }
}
