package com.sih.Q_Six.QubitQuest.controller;

import com.sih.Q_Six.QubitQuest.dtos.TopicDetailDto;
import com.sih.Q_Six.QubitQuest.dtos.TopicSummaryDto;
import com.sih.Q_Six.QubitQuest.service.TheoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/theory")
@RequiredArgsConstructor
public class TheoryController {

    private final TheoryService theoryService;

    @GetMapping("/topics")
    public List<TopicSummaryDto> getAllTopics() {
        return theoryService.getAllTopics();
    }

    @GetMapping("/topics/{id}")
    public TopicDetailDto getTopicById(@PathVariable Long id) {
        return theoryService.getTopicById(id);
    }
}