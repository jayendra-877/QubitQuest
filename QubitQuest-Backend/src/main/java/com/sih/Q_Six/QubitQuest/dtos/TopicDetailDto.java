package com.sih.Q_Six.QubitQuest.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicDetailDto {

    private Long id;
    private String title;
    private String description;
    private String content;
    private Integer orderNumber;
    private Instant createdAt;
    private Instant updatedAt;
}