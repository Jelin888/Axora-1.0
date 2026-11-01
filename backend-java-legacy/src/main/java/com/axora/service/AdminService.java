package com.axora.service;

import com.axora.dto.AdminDashboardDTO;
import com.axora.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    AdminDashboardDTO getDashboardStats();
    Page<UserDTO> getAllUsers(String keyword, String role, Pageable pageable);
    UserDTO updateUserStatus(Long userId, com.axora.entity.UserStatus status);
}
