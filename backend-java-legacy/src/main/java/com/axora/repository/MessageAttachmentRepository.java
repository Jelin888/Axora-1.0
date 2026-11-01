package com.axora.repository;

import com.axora.entity.MessageAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageAttachmentRepository extends JpaRepository<MessageAttachment, Long>, JpaSpecificationExecutor<MessageAttachment> {
}
