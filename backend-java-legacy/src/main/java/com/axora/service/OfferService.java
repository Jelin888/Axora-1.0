package com.axora.service;

import com.axora.dto.OfferDTO;

import java.util.List;

public interface OfferService {
    List<OfferDTO> getActiveOffers();
    List<OfferDTO> getAll();
    OfferDTO create(OfferDTO dto);
    OfferDTO update(Long id, OfferDTO dto);
    void delete(Long id);
}
