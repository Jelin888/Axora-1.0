package com.axora.controller;

import com.axora.dto.PortfolioProjectDTO;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PortfolioProjectDTO>>> myPortfolio(@AuthenticationPrincipal AxoraUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success("OK", portfolioService.getMyPortfolio(principal.getUser())));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<ApiResponse<List<PortfolioProjectDTO>>> byFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(ApiResponse.success("OK", portfolioService.getByFreelancerId(freelancerId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PortfolioProjectDTO>> create(@AuthenticationPrincipal AxoraUserDetails principal,
                                                                     @RequestBody PortfolioProjectDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Portfolio project added",
                portfolioService.create(principal.getUser(), dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PortfolioProjectDTO>> update(@AuthenticationPrincipal AxoraUserDetails principal,
                                                                     @PathVariable Long id, @RequestBody PortfolioProjectDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Portfolio project updated",
                portfolioService.update(principal.getUser(), id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal AxoraUserDetails principal, @PathVariable Long id) {
        portfolioService.delete(principal.getUser(), id);
        return ResponseEntity.ok(ApiResponse.success("Portfolio project deleted", null));
    }
}
