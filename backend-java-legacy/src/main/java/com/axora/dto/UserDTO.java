package com.axora.dto;

import com.axora.entity.Role;
import com.axora.entity.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private UserStatus status;
    private String profilePhotoUrl;
    private String phone;
    private LocalDateTime createdAt;
}
