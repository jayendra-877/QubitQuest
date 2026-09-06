package com.sih.Q_Six.QubitQuest.repository;

import com.sih.Q_Six.QubitQuest.entity.ChallengeProgress;
import com.sih.Q_Six.QubitQuest.enums.ProgressStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeProgressRepository extends JpaRepository<ChallengeProgress,Long> {
    Optional<ChallengeProgress> findByUserIdAndChallengeId(Long userId, Long challengeId);
    List<ChallengeProgress> findByUserId(Long userId);
    List<ChallengeProgress> findByUserIdAndStatus(Long userId, ProgressStatus status);
}
