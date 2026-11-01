package com.axora.controller;

import com.axora.dto.CreateProposalRequest;
import com.axora.dto.ProposalDTO;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.ProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;

    @PostMapping("/api/projects/{projectId}/proposals")
    public ResponseEntity<ApiResponse<ProposalDTO>> submit(@AuthenticationPrincipal AxoraUserDetails principal,
                                                             @PathVariable Long projectId,
                                                             @Valid @RequestBody CreateProposalRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Proposal submitted successfully",
                proposalService.submit(principal.getUser(), projectId, request)));
    }

    @GetMapping("/api/projects/{projectId}/proposals")
    public ResponseEntity<ApiResponse<List<ProposalDTO>>> byProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("OK", proposalService.getByProject(projectId)));
    }

    @GetMapping("/api/proposals/my")
    public ResponseEntity<ApiResponse<List<ProposalDTO>>> myProposals(@AuthenticationPrincipal AxoraUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success("OK", proposalService.getMyProposals(principal.getUser())));
    }

    @PutMapping("/api/proposals/{id}/accept")
    public ResponseEntity<ApiResponse<ProposalDTO>> accept(@AuthenticationPrincipal AxoraUserDetails principal, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Proposal accepted", proposalService.accept(principal.getUser(), id)));
    }

    @PutMapping("/api/proposals/{id}/reject")
    public ResponseEntity<ApiResponse<ProposalDTO>> reject(@AuthenticationPrincipal AxoraUserDetails principal, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Proposal rejected", proposalService.reject(principal.getUser(), id)));
    }
}
