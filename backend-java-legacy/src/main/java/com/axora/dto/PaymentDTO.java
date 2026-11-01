package com.axora.dto;

import com.axora.entity.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentDTO {
    private Long id;
    private String transactionId;
    private Long projectId;
    private String projectTitle;
    private String payerName;
    private String receiverName;
    private BigDecimal amount;
    private PaymentStatus status;
    private String upiIntentUrl;
    private java.time.LocalDateTime createdAt;
}
