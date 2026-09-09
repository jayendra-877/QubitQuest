package com.sih.Q_Six.QubitQuest.service;

import com.sih.Q_Six.QubitQuest.dtos.TopicDetailDto;
import com.sih.Q_Six.QubitQuest.dtos.TopicSummaryDto;

import java.util.List;

public interface TheoryService {

    List<TopicSummaryDto> getAllTopics();

    TopicDetailDto getTopicById(Long id);
}