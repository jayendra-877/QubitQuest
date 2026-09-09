package com.sih.Q_Six.QubitQuest.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "challenge_attempts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChallengeAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "challenge_id", nullable = false)
    private Long challengeId;

    @Column(name = "submitted_circuit_json", columnDefinition = "TEXT")
    private String submittedCircuitJson;

    @Column(name = "result_json", columnDefinition = "TEXT")
    private String resultJson;

    @Column(nullable = false)
    private Boolean correct;

    @Column(name = "points_awarded")
    private Integer pointsAwarded = 0;

    @Column(name = "gate_count")
    private Integer gateCount;

    @Column(name = "circuit_depth")
    private Integer circuitDepth;

    @CreationTimestamp
    @Column(name = "submitted_at")
    private Instant submittedAt;
}
