package com.axora.dto;

import com.axora.entity.ProposalStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProposalDTO {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long freelancerId;
    private String freelancerName;
    private String coverLetter;
    private BigDecimal proposedAmount;
    private Integer estimatedDeliveryDays;
    private ProposalStatus status;
    private java.time.LocalDateTime createdAt;
}
