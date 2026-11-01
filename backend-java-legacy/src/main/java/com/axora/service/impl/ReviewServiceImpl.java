package com.axora.service.impl;

import com.axora.dto.CreateReviewRequest;
import com.axora.dto.ReviewDTO;
import com.axora.entity.*;
import com.axora.exception.BadRequestException;
import com.axora.exception.ResourceNotFoundException;
import com.axora.repository.*;
import com.axora.service.NotificationService;
import com.axora.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final NotificationService notificationService;

    private ReviewDTO toDto(Review r) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(r.getId());
        dto.setProjectId(r.getProject().getId());
        dto.setProjectTitle(r.getProject().getTitle());
        dto.setReviewerId(r.getReviewer().getId());
        dto.setReviewerName(r.getReviewer().getFullName());
        dto.setRevieweeId(r.getReviewee().getId());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    @Override
    public ReviewDTO create(User reviewer, CreateReviewRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewee not found"));

        if (reviewRepository.existsByProject_IdAndReviewer_Id(project.getId(), reviewer.getId())) {
            throw new BadRequestException("You have already reviewed this project");
        }

        Review review = new Review();
        review.setProject(project);
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);

        // Recalculate freelancer average rating if reviewee is a freelancer
        if (reviewee.getRole() == Role.ROLE_FREELANCER) {
            freelancerProfileRepository.findByUser_Id(reviewee.getId()).ifPresent(profile -> {
                List<Review> allReviews = reviewRepository.findByReviewee_Id(reviewee.getId());
                double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
                profile.setAverageRating(Math.round(avg * 10.0) / 10.0);
                freelancerProfileRepository.save(profile);
            });
        }

        notificationService.notify(reviewee.getId(),
                "You received a " + request.getRating() + "-star review", "REVIEW");

        return toDto(review);
    }

    @Override
    public List<ReviewDTO> getForProject(Long projectId) {
        return reviewRepository.findByProject_Id(projectId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getForUser(Long userId) {
        return reviewRepository.findByReviewee_Id(userId).stream().map(this::toDto).collect(Collectors.toList());
    }
}
