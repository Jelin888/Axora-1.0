package com.axora.service.impl;

import com.axora.dto.OfferDTO;
import com.axora.entity.Offer;
import com.axora.entity.OfferStatus;
import com.axora.exception.ResourceNotFoundException;
import com.axora.repository.OfferRepository;
import com.axora.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;

    private OfferDTO toDto(Offer o) {
        OfferDTO dto = new OfferDTO();
        dto.setId(o.getId());
        dto.setTitle(o.getTitle());
        dto.setDescription(o.getDescription());
        dto.setImageUrl(o.getImageUrl());
        dto.setStartDate(o.getStartDate());
        dto.setEndDate(o.getEndDate());
        dto.setStatus(o.getStatus());
        return dto;
    }

    @Override
    public List<OfferDTO> getActiveOffers() {
        return offerRepository.findByStatus(OfferStatus.ACTIVE).stream()
                .filter(o -> o.getEndDate() == null || !o.getEndDate().isBefore(LocalDate.now()))
                .map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<OfferDTO> getAll() {
        return offerRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public OfferDTO create(OfferDTO dto) {
        Offer o = new Offer();
        o.setTitle(dto.getTitle());
        o.setDescription(dto.getDescription());
        o.setImageUrl(dto.getImageUrl());
        o.setStartDate(dto.getStartDate());
        o.setEndDate(dto.getEndDate());
        o.setStatus(dto.getStatus() != null ? dto.getStatus() : OfferStatus.ACTIVE);
        offerRepository.save(o);
        return toDto(o);
    }

    @Override
    public OfferDTO update(Long id, OfferDTO dto) {
        Offer o = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));
        o.setTitle(dto.getTitle());
        o.setDescription(dto.getDescription());
        o.setImageUrl(dto.getImageUrl());
        o.setStartDate(dto.getStartDate());
        o.setEndDate(dto.getEndDate());
        o.setStatus(dto.getStatus());
        offerRepository.save(o);
        return toDto(o);
    }

    @Override
    public void delete(Long id) {
        offerRepository.deleteById(id);
    }
}
