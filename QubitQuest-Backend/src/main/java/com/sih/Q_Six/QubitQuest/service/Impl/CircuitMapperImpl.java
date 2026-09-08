package com.sih.Q_Six.QubitQuest.service.Impl;

import com.sih.Q_Six.QubitQuest.dtos.ExecutionRequest;
import com.sih.Q_Six.QubitQuest.dtos.GateDto;
import com.sih.Q_Six.QubitQuest.dtos.OperationRequestDto;
import com.sih.Q_Six.QubitQuest.exceptions.InvalidCircuitException;
import com.sih.Q_Six.QubitQuest.service.CircuitMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class CircuitMapperImpl implements CircuitMapper {

    private static final Set<String> CONTROLLED_GATES =
            Set.of("CNOT", "CZ", "SWAP");

    private static final int DEFAULT_SHOTS = 1000;

    @Override
    public ExecutionRequest toExecutionRequest(String circuitJson, String mode) {

        try {
            JsonNode root = new ObjectMapper().readTree(circuitJson);

            // Your JSON uses "qubits"
            int numQubits = root.get("qubits").asInt();

            List<GateDto> gates = new ArrayList<>();

            for (JsonNode gateNode : root.get("gates")) {

                String type = gateNode.get("type").asText();

                // Every gate in your JSON has a target
                Integer target = gateNode.get("target").asInt();

                // Only two-qubit gates have control
                Integer control = null;

                if (CONTROLLED_GATES.contains(type)) {
                    control = gateNode.get("control").asInt();
                }

                // Read params directly from JSON
                List<Double> params = new ArrayList<>();

                if (gateNode.has("params")
                        && gateNode.get("params").isArray()) {

                    for (JsonNode param : gateNode.get("params")) {
                        params.add(param.asDouble());
                    }
                }

                gates.add(
                        new GateDto(
                                type,
                                target,
                                control,
                                params
                        )
                );
            }

            // Read shots from JSON, otherwise use default
            int shots = root.has("shots")
                    ? root.get("shots").asInt()
                    : DEFAULT_SHOTS;

            // Use JSON mode if present, otherwise method parameter
            String executionMode = root.has("mode")
                    ? root.get("mode").asText()
                    : mode;

            return new ExecutionRequest(
                    numQubits,
                    gates,
                    shots,
                    executionMode
            );

        } catch (Exception e) {

            throw new InvalidCircuitException(
                    "Could not parse circuit JSON"
            );
        }
    }
}
