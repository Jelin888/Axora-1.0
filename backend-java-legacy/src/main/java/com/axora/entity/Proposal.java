package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "proposals")
public class Proposal extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;

    @Column(length = 3000)
    private String coverLetter;

    private BigDecimal proposedAmount;
    private Integer estimatedDeliveryDays;

    @Enumerated(EnumType.STRING)
    private ProposalStatus status = ProposalStatus.PENDING;
}
