package com.axora.service.impl;

import com.axora.dto.AuthResponse;
import com.axora.dto.LoginRequest;
import com.axora.dto.RegisterRequest;
import com.axora.entity.*;
import com.axora.exception.BadRequestException;
import com.axora.repository.ClientProfileRepository;
import com.axora.repository.FreelancerProfileRepository;
import com.axora.repository.UserRepository;
import com.axora.security.AxoraUserDetails;
import com.axora.security.JwtUtil;
import com.axora.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Role role;
        try {
            role = Role.valueOf("ROLE_" + request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Must be FREELANCER or CLIENT");
        }
        if (role == Role.ROLE_ADMIN) {
            throw new BadRequestException("Cannot self-register as admin");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);

        if (role == Role.ROLE_FREELANCER) {
            FreelancerProfile profile = new FreelancerProfile();
            profile.setUser(user);
            freelancerProfileRepository.save(profile);
        } else {
            ClientProfile profile = new ClientProfile();
            profile.setUser(user);
            clientProfileRepository.save(profile);
        }

        AxoraUserDetails userDetails = new AxoraUserDetails(user);
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        AxoraUserDetails userDetails = new AxoraUserDetails(user);
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }
}
