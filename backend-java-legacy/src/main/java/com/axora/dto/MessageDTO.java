package com.axora.dto;

import com.axora.entity.MessageStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDTO {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String content;
    private MessageStatus status;
    private java.time.LocalDateTime createdAt;
}
