package com.axora.repository;

import com.axora.entity.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByProject_Id(Long projectId);
    List<Proposal> findByFreelancer_Id(Long freelancerId);
    boolean existsByProject_IdAndFreelancer_Id(Long projectId, Long freelancerId);
}
