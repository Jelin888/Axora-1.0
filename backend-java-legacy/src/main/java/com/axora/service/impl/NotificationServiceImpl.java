package com.axora.service.impl;

import com.axora.dto.NotificationDTO;
import com.axora.entity.Notification;
import com.axora.entity.User;
import com.axora.exception.ResourceNotFoundException;
import com.axora.exception.UnauthorizedException;
import com.axora.repository.NotificationRepository;
import com.axora.repository.UserRepository;
import com.axora.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private NotificationDTO toDto(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setMessage(n.getMessage());
        dto.setType(n.getType());
        dto.setIsRead(n.getIsRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    @Override
    public List<NotificationDTO> getMyNotifications(User currentUser) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(currentUser.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public void markAsRead(User currentUser, Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!n.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Not your notification");
        }
        n.setIsRead(true);
        notificationRepository.save(n);
    }

    @Override
    public void notify(Long userId, String message, String type) {
        userRepository.findById(userId).ifPresent(user -> {
            Notification n = new Notification();
            n.setUser(user);
            n.setMessage(message);
            n.setType(type);
            n.setIsRead(false);
            notificationRepository.save(n);
        });
    }
}
