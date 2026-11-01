package com.axora.service;

import com.axora.dto.UserDTO;
import com.axora.entity.User;

public interface UserService {
    UserDTO getCurrentUser(User user);
    UserDTO getById(Long id);
    UserDTO updateProfile(User currentUser, UserDTO dto);
}
