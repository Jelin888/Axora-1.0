package com.axora.controller;

import com.axora.entity.ProjectCategory;
import com.axora.exception.ApiResponse;
import com.axora.repository.ProjectCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final ProjectCategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectCategory>>> all() {
        return ResponseEntity.ok(ApiResponse.success("OK", categoryRepository.findAll()));
    }
}
