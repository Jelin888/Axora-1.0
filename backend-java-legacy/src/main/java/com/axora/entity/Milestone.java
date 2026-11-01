package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "milestones")
public class Milestone extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(nullable = false, length = 200)
    private String title;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private MilestoneStatus status = MilestoneStatus.PENDING;
}
