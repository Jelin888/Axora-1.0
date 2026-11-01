package com.axora.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PortfolioProjectDTO {
    private Long id;
    private String title;
    private String description;
    private String technologies;
    private String imageUrl;
    private String githubUrl;
    private String liveDemoUrl;
    private LocalDate completionDate;
    private String category;
}
