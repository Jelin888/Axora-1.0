package com.axora.dto;

import com.axora.entity.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateProjectRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private String requiredSkills;
    private Long categoryId;
    @NotNull
    private BigDecimal budget;
    private LocalDate deadline;
    private ProjectType projectType;
    private String attachmentUrl;
}
