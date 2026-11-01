package com.axora.service.impl;

import com.axora.dto.CreateProposalRequest;
import com.axora.dto.ProposalDTO;
import com.axora.entity.*;
import com.axora.exception.BadRequestException;
import com.axora.exception.ResourceNotFoundException;
import com.axora.exception.UnauthorizedException;
import com.axora.repository.*;
import com.axora.service.NotificationService;
import com.axora.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalServiceImpl implements ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final NotificationService notificationService;

    private ProposalDTO toDto(Proposal p) {
        ProposalDTO dto = new ProposalDTO();
        dto.setId(p.getId());
        dto.setProjectId(p.getProject().getId());
        dto.setProjectTitle(p.getProject().getTitle());
        dto.setFreelancerId(p.getFreelancer().getId());
        dto.setFreelancerName(p.getFreelancer().getFullName());
        dto.setCoverLetter(p.getCoverLetter());
        dto.setProposedAmount(p.getProposedAmount());
        dto.setEstimatedDeliveryDays(p.getEstimatedDeliveryDays());
        dto.setStatus(p.getStatus());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }

    @Override
    public ProposalDTO submit(User freelancer, Long projectId, CreateProposalRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new BadRequestException("This project is no longer open for proposals");
        }
        if (proposalRepository.existsByProject_IdAndFreelancer_Id(projectId, freelancer.getId())) {
            throw new BadRequestException("You have already submitted a proposal for this project");
        }

        Proposal proposal = new Proposal();
        proposal.setProject(project);
        proposal.setFreelancer(freelancer);
        proposal.setCoverLetter(request.getCoverLetter());
        proposal.setProposedAmount(request.getProposedAmount());
        proposal.setEstimatedDeliveryDays(request.getEstimatedDeliveryDays());
        proposal.setStatus(ProposalStatus.PENDING);
        proposalRepository.save(proposal);

        notificationService.notify(project.getClient().getId(),
                "New proposal received for \"" + project.getTitle() + "\"", "PROPOSAL");

        return toDto(proposal);
    }

    @Override
    public List<ProposalDTO> getByProject(Long projectId) {
        return proposalRepository.findByProject_Id(projectId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ProposalDTO> getMyProposals(User freelancer) {
        return proposalRepository.findByFreelancer_Id(freelancer.getId()).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProposalDTO accept(User client, Long proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));
        Project project = proposal.getProject();

        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("You do not own this project");
        }

        proposal.setStatus(ProposalStatus.ACCEPTED);
        project.setStatus(ProjectStatus.IN_PROGRESS);
        proposalRepository.save(proposal);
        projectRepository.save(project);

        Contract contract = new Contract();
        contract.setProject(project);
        contract.setClient(client);
        contract.setFreelancer(proposal.getFreelancer());
        contract.setProgressPercent(0);
        contractRepository.save(contract);

        notificationService.notify(proposal.getFreelancer().getId(),
                "Your proposal for \"" + project.getTitle() + "\" was accepted!", "PROPOSAL_ACCEPTED");

        return toDto(proposal);
    }

    @Override
    public ProposalDTO reject(User client, Long proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));
        if (!proposal.getProject().getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("You do not own this project");
        }
        proposal.setStatus(ProposalStatus.REJECTED);
        proposalRepository.save(proposal);

        notificationService.notify(proposal.getFreelancer().getId(),
                "Your proposal for \"" + proposal.getProject().getTitle() + "\" was rejected", "PROPOSAL_REJECTED");

        return toDto(proposal);
    }
}
