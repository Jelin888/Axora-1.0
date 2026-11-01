package com.axora.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ConversationDTO {
    private Long id;
    private Long relatedProjectId;
    private List<UserDTO> members;
    private MessageDTO lastMessage;
}
