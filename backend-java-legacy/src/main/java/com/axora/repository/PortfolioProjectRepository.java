package com.axora.repository;

import com.axora.entity.PortfolioProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {
    List<PortfolioProject> findByFreelancer_Id(Long freelancerId);
}
