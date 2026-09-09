package com.sih.Q_Six.QubitQuest.service.Impl;

import com.sih.Q_Six.QubitQuest.dtos.TopicDetailDto;
import com.sih.Q_Six.QubitQuest.dtos.TopicSummaryDto;
import com.sih.Q_Six.QubitQuest.entity.Topic;
import com.sih.Q_Six.QubitQuest.exceptions.ResourceNotFoundException;
import com.sih.Q_Six.QubitQuest.repository.TopicRepository;
import com.sih.Q_Six.QubitQuest.service.TheoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheoryServiceImpl implements TheoryService {

    private final TopicRepository topicRepository;

    @Override
    public List<TopicSummaryDto> getAllTopics() {

        return topicRepository.findAllByOrderByOrderNumberAsc()
                .stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @Override
    public TopicDetailDto getTopicById(Long id) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Topic not found with id: " + id)
                );

        return toDetailDto(topic);
    }

    private TopicSummaryDto toSummaryDto(Topic topic) {

        return new TopicSummaryDto(
                topic.getId(),
                topic.getTitle(),
                topic.getDescription(),
                topic.getOrderNumber()
        );
    }

    private TopicDetailDto toDetailDto(Topic topic) {

        return new TopicDetailDto(
                topic.getId(),
                topic.getTitle(),
                topic.getDescription(),
                topic.getContent(),
                topic.getOrderNumber(),
                topic.getCreatedAt(),
                topic.getUpdatedAt()
        );
    }
}