package com.axora.controller;

import com.axora.dto.UserDTO;
import com.axora.entity.User;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> me(@AuthenticationPrincipal AxoraUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success("OK", userService.getCurrentUser(principal.getUser())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> updateMe(@AuthenticationPrincipal AxoraUserDetails principal,
                                                           @RequestBody UserDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(principal.getUser(), dto)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", userService.getById(id)));
    }
}
