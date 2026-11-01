package com.axora.controller;

import com.axora.dto.CreateProjectRequest;
import com.axora.dto.ProjectDTO;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDTO>> create(@AuthenticationPrincipal AxoraUserDetails principal,
                                                            @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Project posted successfully",
                projectService.create(principal.getUser(), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProjectDTO>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                projectService.search(keyword, categoryId, status, PageRequest.of(page, size))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", projectService.getById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> update(@AuthenticationPrincipal AxoraUserDetails principal,
                                                            @PathVariable Long id, @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Project updated",
                projectService.update(principal.getUser(), id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal AxoraUserDetails principal, @PathVariable Long id) {
        projectService.delete(principal.getUser(), id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted", null));
    }
}
