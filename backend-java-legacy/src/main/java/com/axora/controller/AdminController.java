package com.axora.controller;

import com.axora.dto.AdminDashboardDTO;
import com.axora.dto.UpdateUserStatusRequest;
import com.axora.dto.UserDTO;
import com.axora.exception.ApiResponse;
import com.axora.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDTO>> dashboard() {
        return ResponseEntity.ok(ApiResponse.success("OK", adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> users(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("OK", adminService.getAllUsers(keyword, role, PageRequest.of(page, size))));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDTO>> updateStatus(@PathVariable Long id, @RequestBody UpdateUserStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User status updated", adminService.updateUserStatus(id, request.getStatus())));
    }
}
