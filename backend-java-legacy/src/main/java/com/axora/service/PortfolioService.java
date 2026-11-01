package com.axora.service;

import com.axora.dto.PortfolioProjectDTO;
import com.axora.entity.User;

import java.util.List;

public interface PortfolioService {
    List<PortfolioProjectDTO> getMyPortfolio(User currentUser);
    List<PortfolioProjectDTO> getByFreelancerId(Long freelancerId);
    PortfolioProjectDTO create(User currentUser, PortfolioProjectDTO dto);
    PortfolioProjectDTO update(User currentUser, Long id, PortfolioProjectDTO dto);
    void delete(User currentUser, Long id);
}
