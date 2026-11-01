package com.axora.service;

import com.axora.dto.FreelancerProfileDTO;
import com.axora.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FreelancerService {
    Page<FreelancerProfileDTO> search(String keyword, String skill, Double minRating, Pageable pageable);
    FreelancerProfileDTO getById(Long id);
    FreelancerProfileDTO updateMyProfile(User currentUser, FreelancerProfileDTO dto);
}
