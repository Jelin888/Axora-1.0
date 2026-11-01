package com.axora.service.impl;

import com.axora.dto.FreelancerProfileDTO;
import com.axora.entity.FreelancerProfile;
import com.axora.entity.Skill;
import com.axora.entity.User;
import com.axora.exception.ResourceNotFoundException;
import com.axora.repository.FreelancerProfileRepository;
import com.axora.repository.SkillRepository;
import com.axora.service.FreelancerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FreelancerServiceImpl implements FreelancerService {

    private final FreelancerProfileRepository freelancerProfileRepository;
    private final SkillRepository skillRepository;

    private FreelancerProfileDTO toDto(FreelancerProfile p) {
        FreelancerProfileDTO dto = new FreelancerProfileDTO();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setFullName(p.getUser().getFullName());
        dto.setProfilePhotoUrl(p.getUser().getProfilePhotoUrl());
        dto.setEmail(p.getUser().getEmail());
        dto.setPhone(p.getUser().getPhone());
        dto.setProfessionalTitle(p.getProfessionalTitle());
        dto.setBio(p.getBio());
        dto.setLocation(p.getLocation());
        dto.setExperienceYears(p.getExperienceYears());
        dto.setHourlyRate(p.getHourlyRate());
        dto.setAvailable(p.getAvailable());
        dto.setLinkedinUrl(p.getLinkedinUrl());
        dto.setGithubUrl(p.getGithubUrl());
        dto.setWebsiteUrl(p.getWebsiteUrl());
        dto.setAverageRating(p.getAverageRating());
        dto.setCompletedProjects(p.getCompletedProjects());
        dto.setSkills(p.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()));
        return dto;
    }

    @Override
    public Page<FreelancerProfileDTO> search(String keyword, String skill, Double minRating, Pageable pageable) {
        Specification<FreelancerProfile> spec = Specification.where(null);

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("user").get("fullName")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("professionalTitle")), "%" + keyword.toLowerCase() + "%")
            ));
        }
        if (minRating != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("averageRating"), minRating));
        }

        Page<FreelancerProfile> page = freelancerProfileRepository.findAll(spec, pageable);
        return page.map(this::toDto);
    }

    @Override
    public FreelancerProfileDTO getById(Long id) {
        FreelancerProfile p = freelancerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found"));
        return toDto(p);
    }

    @Override
    public FreelancerProfileDTO updateMyProfile(User currentUser, FreelancerProfileDTO dto) {
        FreelancerProfile p = freelancerProfileRepository.findByUser_Id(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found"));

        p.setProfessionalTitle(dto.getProfessionalTitle());
        p.setBio(dto.getBio());
        p.setLocation(dto.getLocation());
        p.setExperienceYears(dto.getExperienceYears());
        p.setHourlyRate(dto.getHourlyRate());
        p.setAvailable(dto.getAvailable());
        p.setLinkedinUrl(dto.getLinkedinUrl());
        p.setGithubUrl(dto.getGithubUrl());
        p.setWebsiteUrl(dto.getWebsiteUrl());

        if (dto.getSkills() != null) {
            Set<Skill> skillEntities = new HashSet<>();
            for (String skillName : dto.getSkills()) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                        .orElseGet(() -> {
                            Skill s = new Skill();
                            s.setName(skillName);
                            return skillRepository.save(s);
                        });
                skillEntities.add(skill);
            }
            p.setSkills(skillEntities);
        }

        freelancerProfileRepository.save(p);
        return toDto(p);
    }
}
