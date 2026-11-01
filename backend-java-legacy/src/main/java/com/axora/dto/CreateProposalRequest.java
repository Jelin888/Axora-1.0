package com.axora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateProposalRequest {
    @NotBlank
    private String coverLetter;
    @NotNull
    private BigDecimal proposedAmount;
    private Integer estimatedDeliveryDays;
}
