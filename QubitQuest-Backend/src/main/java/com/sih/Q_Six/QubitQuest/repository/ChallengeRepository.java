package com.sih.Q_Six.QubitQuest.repository;

import com.sih.Q_Six.QubitQuest.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge,Long> {
    List<Challenge> findByMissionIdOrderByOrderNumberAsc(Long missionId);

}
