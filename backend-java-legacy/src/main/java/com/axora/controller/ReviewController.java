package com.axora.controller;

import com.axora.dto.CreateReviewRequest;
import com.axora.dto.ReviewDTO;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/api/reviews")
    public ResponseEntity<ApiResponse<ReviewDTO>> create(@AuthenticationPrincipal AxoraUserDetails principal,
                                                           @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Review submitted", reviewService.create(principal.getUser(), request)));
    }

    @GetMapping("/api/projects/{projectId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> forProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("OK", reviewService.getForProject(projectId)));
    }

    @GetMapping("/api/users/{userId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> forUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("OK", reviewService.getForUser(userId)));
    }
}
