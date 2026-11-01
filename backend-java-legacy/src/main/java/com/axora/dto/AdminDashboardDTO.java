package com.axora.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class AdminDashboardDTO {
    private long totalUsers;
    private long totalFreelancers;
    private long totalClients;
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long totalProposals;
    private long totalTransactions;
    private BigDecimal totalRevenue;
}
