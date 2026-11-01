package com.axora.service;

import com.axora.dto.NotificationDTO;
import com.axora.entity.User;

import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getMyNotifications(User currentUser);
    void markAsRead(User currentUser, Long id);
    void notify(Long userId, String message, String type);
}
