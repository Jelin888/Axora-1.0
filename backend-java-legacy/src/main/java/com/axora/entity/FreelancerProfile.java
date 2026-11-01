package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "freelancer_profiles")
public class FreelancerProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String professionalTitle;

    @Column(length = 2000)
    private String bio;

    private String location;
    private Integer experienceYears;
    private BigDecimal hourlyRate;
    private Boolean available = true;

    private String linkedinUrl;
    private String githubUrl;
    private String websiteUrl;

    private Double averageRating = 0.0;
    private Integer completedProjects = 0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "freelancer_skills",
            joinColumns = @JoinColumn(name = "freelancer_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();
}
