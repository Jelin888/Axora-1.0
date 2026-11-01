package com.axora.controller;

import com.axora.dto.*;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConversationDTO>>> myConversations(@AuthenticationPrincipal AxoraUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success("OK", messageService.getMyConversations(principal.getUser())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ConversationDTO>> create(@AuthenticationPrincipal AxoraUserDetails principal,
                                                                 @RequestBody CreateConversationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Conversation ready",
                messageService.createOrGetConversation(principal.getUser(), request)));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<List<MessageDTO>>> getMessages(@AuthenticationPrincipal AxoraUserDetails principal,
                                                                       @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", messageService.getMessages(principal.getUser(), id)));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessage(@AuthenticationPrincipal AxoraUserDetails principal,
                                                                 @PathVariable Long id, @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Message sent",
                messageService.sendMessage(principal.getUser(), id, request)));
    }
}
