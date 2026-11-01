package com.axora.service;

import com.axora.dto.ConversationDTO;
import com.axora.dto.CreateConversationRequest;
import com.axora.dto.MessageDTO;
import com.axora.dto.SendMessageRequest;
import com.axora.entity.User;

import java.util.List;

public interface MessageService {
    ConversationDTO createOrGetConversation(User currentUser, CreateConversationRequest request);
    List<ConversationDTO> getMyConversations(User currentUser);
    List<MessageDTO> getMessages(User currentUser, Long conversationId);
    MessageDTO sendMessage(User currentUser, Long conversationId, SendMessageRequest request);
}
