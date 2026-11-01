package com.axora.repository;

import com.axora.entity.FreelancerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfile, Long>, JpaSpecificationExecutor<FreelancerProfile> {
    Optional<FreelancerProfile> findByUser_Id(Long userId);
}
