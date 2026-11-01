package com.axora.service.impl;

import com.axora.dto.PortfolioProjectDTO;
import com.axora.entity.PortfolioProject;
import com.axora.entity.User;
import com.axora.exception.ResourceNotFoundException;
import com.axora.exception.UnauthorizedException;
import com.axora.repository.PortfolioProjectRepository;
import com.axora.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioProjectRepository portfolioProjectRepository;

    private PortfolioProjectDTO toDto(PortfolioProject p) {
        PortfolioProjectDTO dto = new PortfolioProjectDTO();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setTechnologies(p.getTechnologies());
        dto.setImageUrl(p.getImageUrl());
        dto.setGithubUrl(p.getGithubUrl());
        dto.setLiveDemoUrl(p.getLiveDemoUrl());
        dto.setCompletionDate(p.getCompletionDate());
        dto.setCategory(p.getCategory());
        return dto;
    }

    @Override
    public List<PortfolioProjectDTO> getMyPortfolio(User currentUser) {
        return portfolioProjectRepository.findByFreelancer_Id(currentUser.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<PortfolioProjectDTO> getByFreelancerId(Long freelancerId) {
        return portfolioProjectRepository.findByFreelancer_Id(freelancerId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public PortfolioProjectDTO create(User currentUser, PortfolioProjectDTO dto) {
        PortfolioProject p = new PortfolioProject();
        p.setFreelancer(currentUser);
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setTechnologies(dto.getTechnologies());
        p.setImageUrl(dto.getImageUrl());
        p.setGithubUrl(dto.getGithubUrl());
        p.setLiveDemoUrl(dto.getLiveDemoUrl());
        p.setCompletionDate(dto.getCompletionDate());
        p.setCategory(dto.getCategory());
        portfolioProjectRepository.save(p);
        return toDto(p);
    }

    @Override
    public PortfolioProjectDTO update(User currentUser, Long id, PortfolioProjectDTO dto) {
        PortfolioProject p = portfolioProjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio project not found"));
        if (!p.getFreelancer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not own this portfolio project");
        }
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setTechnologies(dto.getTechnologies());
        p.setImageUrl(dto.getImageUrl());
        p.setGithubUrl(dto.getGithubUrl());
        p.setLiveDemoUrl(dto.getLiveDemoUrl());
        p.setCompletionDate(dto.getCompletionDate());
        p.setCategory(dto.getCategory());
        portfolioProjectRepository.save(p);
        return toDto(p);
    }

    @Override
    public void delete(User currentUser, Long id) {
        PortfolioProject p = portfolioProjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio project not found"));
        if (!p.getFreelancer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not own this portfolio project");
        }
        portfolioProjectRepository.delete(p);
    }
}
