package com.sih.Q_Six.QubitQuest.service.Impl;

import com.sih.Q_Six.QubitQuest.dtos.ExecutionRequest;
import com.sih.Q_Six.QubitQuest.dtos.ExecutionResult;
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
    public ExecutionResult run(ExecutionRequest request){
        try {
            return webClient.post()
                    .uri(executionServiceUrl + "/execute")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ExecutionResult.class)
                    .timeout(Duration.ofSeconds(60))   // bumped from 10 to 60 — cold start protection
                    .block();
        } catch (WebClientResponseException e) {
            e.printStackTrace();  // TEMP — see real cause in console
            throw new ExecutionServiceException("Execution failed: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();  // TEMP — see real cause in console
            throw new ExecutionServiceException("Execution service unreachable: " + e.getMessage());
        }
    }
}
