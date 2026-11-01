package com.axora.service.impl;

import com.axora.dto.*;
import com.axora.entity.*;
import com.axora.exception.ResourceNotFoundException;
import com.axora.exception.UnauthorizedException;
import com.axora.repository.*;
import com.axora.service.MessageService;
import com.axora.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository conversationMemberRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    private MessageDTO toDto(Message m) {
        MessageDTO dto = new MessageDTO();
        dto.setId(m.getId());
        dto.setConversationId(m.getConversation().getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getFullName());
        dto.setContent(m.getContent());
        dto.setStatus(m.getStatus());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }

    private ConversationDTO toDto(Conversation c) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(c.getId());
        dto.setRelatedProjectId(c.getRelatedProject() != null ? c.getRelatedProject().getId() : null);

        List<UserDTO> members = conversationMemberRepository.findByConversation_Id(c.getId()).stream()
                .map(cm -> {
                    UserDTO u = new UserDTO();
                    u.setId(cm.getUser().getId());
                    u.setFullName(cm.getUser().getFullName());
                    u.setProfilePhotoUrl(cm.getUser().getProfilePhotoUrl());
                    u.setRole(cm.getUser().getRole());
                    return u;
                }).collect(Collectors.toList());
        dto.setMembers(members);

        List<Message> messages = messageRepository.findByConversation_IdOrderByCreatedAtAsc(c.getId());
        if (!messages.isEmpty()) {
            dto.setLastMessage(toDto(messages.get(messages.size() - 1)));
        }
        return dto;
    }

    @Override
    public ConversationDTO createOrGetConversation(User currentUser, CreateConversationRequest request) {
        User other = userRepository.findById(request.getOtherUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if a conversation between these two users already exists
        List<ConversationMember> myMemberships = conversationMemberRepository.findByUser_Id(currentUser.getId());
        for (ConversationMember cm : myMemberships) {
            List<ConversationMember> allMembers = conversationMemberRepository.findByConversation_Id(cm.getConversation().getId());
            boolean hasOther = allMembers.stream().anyMatch(m -> m.getUser().getId().equals(other.getId()));
            if (hasOther && allMembers.size() == 2) {
                return toDto(cm.getConversation());
            }
        }

        Conversation conversation = new Conversation();
        if (request.getRelatedProjectId() != null) {
            projectRepository.findById(request.getRelatedProjectId()).ifPresent(conversation::setRelatedProject);
        }
        conversationRepository.save(conversation);

        ConversationMember m1 = new ConversationMember();
        m1.setConversation(conversation);
        m1.setUser(currentUser);
        conversationMemberRepository.save(m1);

        ConversationMember m2 = new ConversationMember();
        m2.setConversation(conversation);
        m2.setUser(other);
        conversationMemberRepository.save(m2);

        return toDto(conversation);
    }

    @Override
    public List<ConversationDTO> getMyConversations(User currentUser) {
        return conversationMemberRepository.findByUser_Id(currentUser.getId()).stream()
                .map(cm -> toDto(cm.getConversation()))
                .collect(Collectors.toList());
    }

    private void assertMember(User user, Long conversationId) {
        boolean isMember = conversationMemberRepository.findByConversation_Id(conversationId).stream()
                .anyMatch(m -> m.getUser().getId().equals(user.getId()));
        if (!isMember) {
            throw new UnauthorizedException("You are not part of this conversation");
        }
    }

    @Override
    public List<MessageDTO> getMessages(User currentUser, Long conversationId) {
        assertMember(currentUser, conversationId);
        return messageRepository.findByConversation_IdOrderByCreatedAtAsc(conversationId).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public MessageDTO sendMessage(User currentUser, Long conversationId, SendMessageRequest request) {
        assertMember(currentUser, conversationId);
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(currentUser);
        message.setContent(request.getContent());
        message.setStatus(MessageStatus.SENT);
        messageRepository.save(message);

        // Notify other members
        conversationMemberRepository.findByConversation_Id(conversationId).stream()
                .filter(m -> !m.getUser().getId().equals(currentUser.getId()))
                .forEach(m -> notificationService.notify(m.getUser().getId(),
                        currentUser.getFullName() + " sent you a message", "MESSAGE"));

        return toDto(message);
    }
}
