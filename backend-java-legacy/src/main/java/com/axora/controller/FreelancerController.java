package com.axora.controller;

import com.axora.dto.FreelancerProfileDTO;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.FreelancerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/freelancers")
@RequiredArgsConstructor
public class FreelancerController {

    private final FreelancerService freelancerService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FreelancerProfileDTO>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<FreelancerProfileDTO> result = freelancerService.search(keyword, skill, minRating, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("OK", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FreelancerProfileDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", freelancerService.getById(id)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<FreelancerProfileDTO>> updateProfile(
            @AuthenticationPrincipal AxoraUserDetails principal, @RequestBody FreelancerProfileDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                freelancerService.updateMyProfile(principal.getUser(), dto)));
    }
}
