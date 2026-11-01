package com.axora.service;

import com.axora.dto.CreateProjectRequest;
import com.axora.dto.ProjectDTO;
import com.axora.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectService {
    ProjectDTO create(User client, CreateProjectRequest request);
    Page<ProjectDTO> search(String keyword, Long categoryId, String status, Pageable pageable);
    ProjectDTO getById(Long id);
    ProjectDTO update(User currentUser, Long id, CreateProjectRequest request);
    void delete(User currentUser, Long id);
}
