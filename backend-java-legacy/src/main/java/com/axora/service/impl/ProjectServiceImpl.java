package com.axora.service.impl;

import com.axora.dto.CreateProjectRequest;
import com.axora.dto.ProjectDTO;
import com.axora.entity.Project;
import com.axora.entity.ProjectCategory;
import com.axora.entity.ProjectStatus;
import com.axora.entity.User;
import com.axora.exception.ResourceNotFoundException;
import com.axora.exception.UnauthorizedException;
import com.axora.repository.ProjectCategoryRepository;
import com.axora.repository.ProjectRepository;
import com.axora.repository.ProposalRepository;
import com.axora.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectCategoryRepository categoryRepository;
    private final ProposalRepository proposalRepository;

    private ProjectDTO toDto(Project p) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(p.getId());
        dto.setClientId(p.getClient().getId());
        dto.setClientName(p.getClient().getFullName());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setRequiredSkills(p.getRequiredSkills());
        dto.setCategory(p.getCategory() != null ? p.getCategory().getName() : null);
        dto.setBudget(p.getBudget());
        dto.setDeadline(p.getDeadline());
        dto.setProjectType(p.getProjectType());
        dto.setStatus(p.getStatus());
        dto.setAttachmentUrl(p.getAttachmentUrl());
        dto.setProposalCount(proposalRepository.findByProject_Id(p.getId()).size());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }

    @Override
    public ProjectDTO create(User client, CreateProjectRequest request) {
        Project p = new Project();
        p.setClient(client);
        p.setTitle(request.getTitle());
        p.setDescription(request.getDescription());
        p.setRequiredSkills(request.getRequiredSkills());
        p.setBudget(request.getBudget());
        p.setDeadline(request.getDeadline());
        p.setProjectType(request.getProjectType());
        p.setAttachmentUrl(request.getAttachmentUrl());
        p.setStatus(ProjectStatus.OPEN);

        if (request.getCategoryId() != null) {
            ProjectCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            p.setCategory(category);
        }

        projectRepository.save(p);
        return toDto(p);
    }

    @Override
    public Page<ProjectDTO> search(String keyword, Long categoryId, String status, Pageable pageable) {
        Specification<Project> spec = Specification.where(null);

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("requiredSkills")), "%" + keyword.toLowerCase() + "%")
            ));
        }
        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }
        if (status != null && !status.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), ProjectStatus.valueOf(status.toUpperCase())));
        }

        return projectRepository.findAll(spec, pageable).map(this::toDto);
    }

    @Override
    public ProjectDTO getById(Long id) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        return toDto(p);
    }

    @Override
    public ProjectDTO update(User currentUser, Long id, CreateProjectRequest request) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (!p.getClient().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not own this project");
        }
        p.setTitle(request.getTitle());
        p.setDescription(request.getDescription());
        p.setRequiredSkills(request.getRequiredSkills());
        p.setBudget(request.getBudget());
        p.setDeadline(request.getDeadline());
        p.setProjectType(request.getProjectType());
        p.setAttachmentUrl(request.getAttachmentUrl());
        if (request.getCategoryId() != null) {
            ProjectCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            p.setCategory(category);
        }
        projectRepository.save(p);
        return toDto(p);
    }

    @Override
    public void delete(User currentUser, Long id) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (!p.getClient().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not own this project");
        }
        projectRepository.delete(p);
    }
}
