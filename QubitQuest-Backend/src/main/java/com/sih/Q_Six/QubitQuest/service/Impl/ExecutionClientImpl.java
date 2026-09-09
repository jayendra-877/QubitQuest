package com.sih.Q_Six.QubitQuest.service.Impl;

import com.sih.Q_Six.QubitQuest.dtos.BlochSphereResponseDto;
import com.sih.Q_Six.QubitQuest.dtos.ExecutionRequest;
import com.sih.Q_Six.QubitQuest.dtos.ExecutionResult;
import com.sih.Q_Six.QubitQuest.dtos.StatevectorResponseDto;
import com.sih.Q_Six.QubitQuest.exceptions.ExecutionServiceException;
import com.sih.Q_Six.QubitQuest.service.ExecutionClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class ExecutionClientImpl implements ExecutionClient {

    private final WebClient webClient;

    @Value("${execution.service.url}")
    private String executionServiceUrl;


    @Override
    public ExecutionResult run(ExecutionRequest request) {

        try {

            return webClient.post()
                    .uri(executionServiceUrl + "/execute")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ExecutionResult.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();

        } catch (WebClientResponseException e) {

            e.printStackTrace();

            throw new ExecutionServiceException(
                    "Execution failed: " + e.getMessage()
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new ExecutionServiceException(
                    "Execution service unreachable: " + e.getMessage()
            );
        }
    }


    @Override
    public StatevectorResponseDto getStatevector(
            ExecutionRequest request
    ) {

        try {

            return webClient.post()
                    .uri(executionServiceUrl + "/statevector")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(StatevectorResponseDto.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();

        } catch (WebClientResponseException e) {

            e.printStackTrace();

            throw new ExecutionServiceException(
                    "Statevector execution failed: " + e.getMessage()
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new ExecutionServiceException(
                    "Quantum statevector service unreachable: "
                            + e.getMessage()
            );
        }
    }


    @Override
    public BlochSphereResponseDto getBlochSphere(
            ExecutionRequest request
    ) {

        try {

            return webClient.post()
                    .uri(executionServiceUrl + "/bloch-sphere")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(BlochSphereResponseDto.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();

        } catch (WebClientResponseException e) {

            e.printStackTrace();

            throw new ExecutionServiceException(
                    "Bloch sphere execution failed: " + e.getMessage()
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new ExecutionServiceException(
                    "Quantum Bloch sphere service unreachable: "
                            + e.getMessage()
            );
        }
    }
}