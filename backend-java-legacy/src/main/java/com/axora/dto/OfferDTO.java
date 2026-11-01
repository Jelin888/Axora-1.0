package com.axora.dto;

import com.axora.entity.OfferStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class OfferDTO {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private OfferStatus status;
}
