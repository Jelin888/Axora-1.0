package com.axora.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDTO {
    private Long id;
    private String message;
    private String type;
    private Boolean isRead;
    private java.time.LocalDateTime createdAt;
}
