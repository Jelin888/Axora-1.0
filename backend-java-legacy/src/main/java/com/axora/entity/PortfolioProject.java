package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "portfolio_projects")
public class PortfolioProject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 3000)
    private String description;

    private String technologies; // comma separated
    private String imageUrl;
    private String githubUrl;
    private String liveDemoUrl;
    private LocalDate completionDate;
    private String category;
}
