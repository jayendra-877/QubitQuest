package com.sih.Q_Six.QubitQuest.entity;

import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "arena_question")
@Getter
@Setter
public class ArenaQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArenaGameMode mode;

    @Column(name = "concept_tag")
    private String conceptTag;

    private String difficulty;

    @Column(
            name = "question_data_json",
            columnDefinition = "json"
    )
    private String questionDataJson;

    @Column(
            name = "answer_data_json",
            columnDefinition = "json"
    )
    private String answerDataJson;

    @Column(nullable = false)
    private Boolean active;
}