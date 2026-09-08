package com.sih.Q_Six.QubitQuest.dtos;

import java.util.List;

public record GateDto(
        String type,
        Integer target,
        Integer control,      // null for single-qubit gates
        List<Double> params
) {
}
