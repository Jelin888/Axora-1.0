package com.axora.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreatePaymentRequest {
    @NotNull
    private Long projectId;
    private Long milestoneId;
    @NotNull
    private Long receiverId;
    @NotNull
    private BigDecimal amount;
    private String upiId;
}
