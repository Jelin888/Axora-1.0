package com.axora.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateConversationRequest {
    private Long otherUserId;
    private Long relatedProjectId;
}
