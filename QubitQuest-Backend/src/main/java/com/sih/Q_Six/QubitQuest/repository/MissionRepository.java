package com.sih.Q_Six.QubitQuest.repository;

import com.sih.Q_Six.QubitQuest.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission,Long> {
    List<Mission> findAllByOrderByOrderNumberAsc();
}
