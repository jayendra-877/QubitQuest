package com.sih.Q_Six.QubitQuest.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedCircuitResponseDto {

    private Long id;
    private String name;
    private String circuitJson;
    private Instant createdAt;
    private Instant updatedAt;
}