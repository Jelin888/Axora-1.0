package com.axora.controller;

import com.axora.dto.NotificationDTO;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> myNotifications(@AuthenticationPrincipal AxoraUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success("OK", notificationService.getMyNotifications(principal.getUser())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@AuthenticationPrincipal AxoraUserDetails principal, @PathVariable Long id) {
        notificationService.markAsRead(principal.getUser(), id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }
}
