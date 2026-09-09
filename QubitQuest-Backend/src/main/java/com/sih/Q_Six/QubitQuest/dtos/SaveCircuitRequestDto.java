package com.sih.Q_Six.QubitQuest.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaveCircuitRequestDto {

    @NotBlank(message = "Circuit name is required")
    private String name;

    @NotBlank(message = "Circuit JSON is required")
    private String circuitJson;
}