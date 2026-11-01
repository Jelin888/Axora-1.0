package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "projects")
public class Project extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 5000)
    private String description;

    private String requiredSkills; // comma separated skill names

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProjectCategory category;

    private BigDecimal budget;
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    private ProjectType projectType = ProjectType.FIXED_PRICE;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.OPEN;

    private String attachmentUrl;
}
