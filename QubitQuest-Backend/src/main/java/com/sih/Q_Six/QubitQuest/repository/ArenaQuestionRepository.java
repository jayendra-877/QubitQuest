package com.sih.Q_Six.QubitQuest.repository;

import com.sih.Q_Six.QubitQuest.entity.ArenaQuestion;
import com.sih.Q_Six.QubitQuest.enums.ArenaGameMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArenaQuestionRepository
        extends JpaRepository<ArenaQuestion, Long> {

    List<ArenaQuestion> findByModeAndActiveTrue(
            ArenaGameMode mode
    );
}
