package com.sih.Q_Six.QubitQuest.entity;

import com.sih.Q_Six.QubitQuest.enums.ChallengeType;
import com.sih.Q_Six.QubitQuest.enums.Difficulty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


import java.time.Instant;

@Entity
@NoArgsConstructor
@Setter
@Getter
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String story;

    @Enumerated(EnumType.STRING)
    @Column(name = "challenge_type", nullable = false)
    private ChallengeType challengeType;

    @Column(name = "concept_tag")
    private String conceptTag;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    // Used when challengeType == BUILD (blank/starting circuit)
    @Column(name = "default_circuit_json", columnDefinition = "TEXT")
    private String defaultCircuitJson;

    // Used when challengeType == DEBUG (intentionally broken circuit to fix)
    @Column(name = "broken_circuit_json", columnDefinition = "TEXT")
    private String brokenCircuitJson;

    // Answer key — required for BUILD and DEBUG, null for PREDICT_ONLY
    @Column(name = "target_outcome_json", columnDefinition = "TEXT")
    private String targetOutcomeJson;   // NEVER exposed to frontend

    @Column(name = "predictor_question", columnDefinition = "TEXT")
    private String predictorQuestion;

    @Column(name = "predictor_options", columnDefinition = "TEXT")
    private String predictorOptionsJson;   // JSON array, nullable

    @Column(name = "correct_prediction")
    private String correctPrediction;      // NEVER exposed to frontend

    @Column(nullable = false)
    private Integer points = 10;

    @Column(name = "order_number", nullable = false)
    private Integer orderNumber;

    @Column(name = "allow_circuit_edit")
    private Boolean allowCircuitEdit = true;

    @Column(name = "ai_enabled_after_run")
    private Boolean aiEnabledAfterRun = true;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;


}
