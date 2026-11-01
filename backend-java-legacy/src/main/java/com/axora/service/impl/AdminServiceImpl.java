package com.axora.service.impl;

import com.axora.dto.AdminDashboardDTO;
import com.axora.dto.UserDTO;
import com.axora.entity.*;
import com.axora.exception.ResourceNotFoundException;
import com.axora.repository.*;
import com.axora.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final PaymentRepository paymentRepository;

    private UserDTO toDto(User u) {
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setFullName(u.getFullName());
        dto.setEmail(u.getEmail());
        dto.setRole(u.getRole());
        dto.setStatus(u.getStatus());
        dto.setProfilePhotoUrl(u.getProfilePhotoUrl());
        dto.setPhone(u.getPhone());
        dto.setCreatedAt(u.getCreatedAt());
        return dto;
    }

    @Override
    public AdminDashboardDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalFreelancers = userRepository.countByRole(Role.ROLE_FREELANCER);
        long totalClients = userRepository.countByRole(Role.ROLE_CLIENT);
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS || p.getStatus() == ProjectStatus.OPEN)
                .count();
        long completedProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProjectStatus.COMPLETED)
                .count();
        long totalProposals = proposalRepository.count();
        long totalTransactions = paymentRepository.count();
        BigDecimal totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminDashboardDTO(totalUsers, totalFreelancers, totalClients, totalProjects,
                activeProjects, completedProjects, totalProposals, totalTransactions, totalRevenue);
    }

    @Override
    public Page<UserDTO> getAllUsers(String keyword, String role, Pageable pageable) {
        Specification<User> spec = Specification.where(null);
        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("fullName")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")), "%" + keyword.toLowerCase() + "%")
            ));
        }
        if (role != null && !role.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("role"), Role.valueOf(role.toUpperCase())));
        }
        return userRepository.findAll(spec, pageable).map(this::toDto);
    }

    @Override
    public UserDTO updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
        return toDto(user);
    }
}
