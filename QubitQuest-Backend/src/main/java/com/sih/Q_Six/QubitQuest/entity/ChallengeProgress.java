package com.sih.Q_Six.QubitQuest.entity;


import com.sih.Q_Six.QubitQuest.enums.ProgressStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "challenge_progress",
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "challenge_id"}))
    @Getter @Setter @NoArgsConstructor
public class ChallengeProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

        @Column(name = "user_id", nullable = false)
        private Long userId;

        @Column(name = "challenge_id", nullable = false)
        private Long challengeId;

        @Enumerated(EnumType.STRING)
        private ProgressStatus status = ProgressStatus.NOT_STARTED;

        @Column(name = "predicted_answer")
        private String predictedAnswer;

        @Column(name = "prediction_correct")
        private Boolean predictionCorrect;

        private Integer attempts = 0;

        @Column(name = "best_points")
        private Integer bestPoints = 0;

        @Column(name = "completed_at")
        private Instant completedAt;

        @Column(name = "last_accessed_at")
        private Instant lastAccessedAt;

        public void incrementAttempts() {
            this.attempts++;
            this.lastAccessedAt = Instant.now();
        }
}
