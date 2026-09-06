package com.sih.Q_Six.QubitQuest.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

    @Entity
    @Table(name = "missions")
    @Getter @Setter @NoArgsConstructor
    public class Mission {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String title;

        @Column(columnDefinition = "TEXT")
        private String description;

        @Column(name = "order_number", nullable = false)
        private Integer orderNumber;

        @CreationTimestamp
        private Instant createdAt;

        @OneToMany(mappedBy = "mission", cascade = CascadeType.ALL)
        @OrderBy("orderNumber ASC")
        private List<Challenge> challenges = new ArrayList<>();

}
