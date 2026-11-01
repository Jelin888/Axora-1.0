package com.axora.repository;

import com.axora.entity.ConversationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationMemberRepository extends JpaRepository<ConversationMember, Long> {
    List<ConversationMember> findByUser_Id(Long userId);
    List<ConversationMember> findByConversation_Id(Long conversationId);
}
