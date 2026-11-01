package com.axora.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long reviewerId;
    private String reviewerName;
    private Long revieweeId;
    private Integer rating;
    private String comment;
    private java.time.LocalDateTime createdAt;
}
