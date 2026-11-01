package com.axora.controller;

import com.axora.entity.Skill;
import com.axora.exception.ApiResponse;
import com.axora.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillRepository skillRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Skill>>> all() {
        return ResponseEntity.ok(ApiResponse.success("OK", skillRepository.findAll()));
    }
}
