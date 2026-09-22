package com.sih.Q_Six.QubitQuest.entity;

import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;
import com.sih.Q_Six.QubitQuest.enums.ArenaMatchStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ArenaMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArenaGameMode mode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArenaMatchStatus status;

    @Column(nullable = false)
    private Long player1Id;

    @Column(nullable = false)
    private Long player2Id;

    private Instant createdAt;

    private Instant countdownStartedAt;

    private Instant gameStartedAt;

    private Instant gameEndsAt;
}