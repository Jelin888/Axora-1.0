package com.axora.service;

import com.axora.dto.AuthResponse;
import com.axora.dto.LoginRequest;
import com.axora.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
