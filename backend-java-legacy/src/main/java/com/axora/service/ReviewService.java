package com.axora.service;

import com.axora.dto.CreateReviewRequest;
import com.axora.dto.ReviewDTO;
import com.axora.entity.User;

import java.util.List;

public interface ReviewService {
    ReviewDTO create(User reviewer, CreateReviewRequest request);
    List<ReviewDTO> getForProject(Long projectId);
    List<ReviewDTO> getForUser(Long userId);
}
