package com.sih.Q_Six.QubitQuest.repository;

import com.sih.Q_Six.QubitQuest.entity.SavedCircuit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedCircuitRepository extends JpaRepository<SavedCircuit, Long> {

    List<SavedCircuit> findAllByUserIdOrderByUpdatedAtDesc(Long userId);
}