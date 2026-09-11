package com.sih.Q_Six.QubitQuest.service.Impl;

import com.sih.Q_Six.QubitQuest.dtos.*;
import com.sih.Q_Six.QubitQuest.dtos.playgroundAi.PlaygroundAiResponseDto;
import com.sih.Q_Six.QubitQuest.exceptions.ExecutionServiceException;
import com.sih.Q_Six.QubitQuest.service.CircuitMapper;
import com.sih.Q_Six.QubitQuest.service.CircuitValidator;
import com.sih.Q_Six.QubitQuest.service.ExecutionClient;
import com.sih.Q_Six.QubitQuest.service.PlaygroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlaygroundServiceImpl implements PlaygroundService {

    private final CircuitValidator circuitValidator;

    private final CircuitMapper circuitMapper;

    private final ExecutionClient executionClient;

    private final ChatClient chatClient;



    @Override
    public PlaygroundAiResponseDto askAi(String circuitJson, String description, String message) {

        String systemPrompt = String.format("""
                You are an expert Quantum Computing AI Assistant operating within a circuit playground.
                The user has provided a description of what they are trying to achieve, 
                their current quantum circuit JSON, and a specific question.
                
                RULES:
                1. Analyze their circuit and address their specific question directly in the 'message' field.
                2. Explain the underlying quantum mechanics or concepts causing their issue.
                3. If the user explicitly asks for the correct circuit, provide the corrected JSON in the 'circuitJson' field.
                4. If no corrected circuit is needed or asked for, leave the 'circuitJson' field empty or null.
                
                USER'S INTENDED GOAL: %s
                CURRENT CIRCUIT JSON: %s
                """, description, circuitJson);

        // Spring AI will automatically parse the LLM's JSON response into your DTO
        PlaygroundAiResponseDto aiResponse = chatClient.prompt()
                .system(systemPrompt)
                .user(message)
                .call()
                .entity(PlaygroundAiResponseDto.class);

        return aiResponse;
    }


    @Override
    public PlaygroundExecuteResponseDto execute(String circuitJson) {

        // 1. Validate circuit
        circuitValidator.validate(circuitJson);

        // 2. Convert circuit JSON into Python API request
        ExecutionRequest request =
                circuitMapper.toExecutionRequest(
                        circuitJson,
                        "measure"
                );

        // 3. Send request to Python
        ExecutionResult result =
                executionClient.run(request);

        // 4. Handle failed Python execution
        if (!result.success()) {

            throw new ExecutionServiceException(
                    result.error() != null
                            ? result.error()
                            : "Quantum execution failed"
            );
        }

        // 5. Return result to frontend
        return new PlaygroundExecuteResponseDto(
                result.counts(),
                result.probabilities(),
                true,
                result.execution_time_ms(),
                result.statevector(),
                result.blochSphere()
        );
    }


    @Override
    public StatevectorResponseDto getStatevector(
            String circuitJson
    ) {

        // 1. Validate circuit
        circuitValidator.validate(circuitJson);

        // 2. Convert circuit
        ExecutionRequest request =
                circuitMapper.toExecutionRequest(
                        circuitJson,
                        "statevector"
                );

        // 3. Call Python statevector API
        StatevectorResponseDto result =
                executionClient.getStatevector(request);

        // 4. Check Python response
        if (!result.isSuccess()) {

            throw new ExecutionServiceException(
                    result.getError() != null
                            ? result.getError()
                            : "Statevector calculation failed"
            );
        }

        return result;
    }


    @Override
    public BlochSphereResponseDto getBlochSphere(
            String circuitJson
    ) {

        // 1. Validate circuit
        circuitValidator.validate(circuitJson);

        // 2. Convert circuit
        ExecutionRequest request =
                circuitMapper.toExecutionRequest(
                        circuitJson,
                        "bloch-sphere"
                );

        // 3. Call Python Bloch sphere API
        BlochSphereResponseDto result =
                executionClient.getBlochSphere(request);

        // 4. Check Python response
        if (!result.isSuccess()) {

            throw new ExecutionServiceException(
                    result.getError() != null
                            ? result.getError()
                            : "Bloch sphere calculation failed"
            );
        }

        return result;
    }
}