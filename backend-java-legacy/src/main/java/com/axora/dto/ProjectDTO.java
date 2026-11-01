package com.axora.dto;

import com.axora.entity.ProjectStatus;
import com.axora.entity.ProjectType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class ProjectDTO {
    private Long id;
    private Long clientId;
    private String clientName;
    private String title;
    private String description;
    private String requiredSkills;
    private String category;
    private BigDecimal budget;
    private LocalDate deadline;
    private ProjectType projectType;
    private ProjectStatus status;
    private String attachmentUrl;
    private Integer proposalCount;
    private java.time.LocalDateTime createdAt;
}
