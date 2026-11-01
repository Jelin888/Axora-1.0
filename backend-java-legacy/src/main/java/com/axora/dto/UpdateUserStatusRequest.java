package com.axora.dto;

import com.axora.entity.UserStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserStatusRequest {
    private UserStatus status;
}
