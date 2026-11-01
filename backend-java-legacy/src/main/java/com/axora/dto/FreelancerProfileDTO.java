package com.axora.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
public class FreelancerProfileDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private String profilePhotoUrl;
    private String professionalTitle;
    private String bio;
    private String location;
    private String email;
    private String phone;
    private Integer experienceYears;
    private BigDecimal hourlyRate;
    private Boolean available;
    private String linkedinUrl;
    private String githubUrl;
    private String websiteUrl;
    private Double averageRating;
    private Integer completedProjects;
    private Set<String> skills;
}
