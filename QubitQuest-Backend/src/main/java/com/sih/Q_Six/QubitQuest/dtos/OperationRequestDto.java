package com.sih.Q_Six.QubitQuest.dtos;

import java.util.List;
import java.util.Map;

public record OperationRequestDto(
        String type,
        String gate,
        List<Integer> targets,
        List<Integer> controls,
        Map<String, Object> parameters
) {
}
