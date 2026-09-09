package com.sih.Q_Six.QubitQuest.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlochSphereResponseDto {

    private boolean success;

    private String status;

    private String backend;

    private String framework;

    private Integer qubits;

    private Map<String, BlochCoordinateDto> coordinates;

    @JsonProperty("request_id")
    private String requestId;

    @JsonProperty("error_code")
    private String errorCode;

    private String error;
}