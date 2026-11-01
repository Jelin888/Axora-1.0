package com.axora.repository;

import com.axora.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByProject_Id(Long projectId);
    List<Contract> findByClient_Id(Long clientId);
    List<Contract> findByFreelancer_Id(Long freelancerId);
}
