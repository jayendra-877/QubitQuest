package com.sih.Q_Six.QubitQuest.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicSummaryDto {

    private Long id;
    private String title;
    private String description;
    private Integer orderNumber;
}