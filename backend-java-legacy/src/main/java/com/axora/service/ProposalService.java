package com.axora.service;

import com.axora.dto.CreateProposalRequest;
import com.axora.dto.ProposalDTO;
import com.axora.entity.User;

import java.util.List;

public interface ProposalService {
    ProposalDTO submit(User freelancer, Long projectId, CreateProposalRequest request);
    List<ProposalDTO> getByProject(Long projectId);
    List<ProposalDTO> getMyProposals(User freelancer);
    ProposalDTO accept(User client, Long proposalId);
    ProposalDTO reject(User client, Long proposalId);
}
