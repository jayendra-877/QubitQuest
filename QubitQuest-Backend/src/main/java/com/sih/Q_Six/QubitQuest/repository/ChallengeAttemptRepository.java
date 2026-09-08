package com.sih.Q_Six.QubitQuest.repository;

import com.sih.Q_Six.QubitQuest.entity.ChallengeAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeAttemptRepository extends JpaRepository<ChallengeAttempt, Long> {
    List<ChallengeAttempt> findByUserIdAndChallengeIdOrderBySubmittedAtDesc(Long userId, Long challengeId);
}
