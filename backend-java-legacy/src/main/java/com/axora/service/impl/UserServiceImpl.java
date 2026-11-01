package com.axora.service.impl;

import com.axora.dto.UserDTO;
import com.axora.entity.User;
import com.axora.exception.ResourceNotFoundException;
import com.axora.repository.UserRepository;
import com.axora.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setPhone(user.getPhone());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    @Override
    public UserDTO getCurrentUser(User user) {
        return toDto(user);
    }

    @Override
    public UserDTO getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toDto(user);
    }

    @Override
    public UserDTO updateProfile(User currentUser, UserDTO dto) {
        currentUser.setFullName(dto.getFullName());
        currentUser.setPhone(dto.getPhone());
        if (dto.getProfilePhotoUrl() != null) {
            currentUser.setProfilePhotoUrl(dto.getProfilePhotoUrl());
        }
        userRepository.save(currentUser);
        return toDto(currentUser);
    }
}
