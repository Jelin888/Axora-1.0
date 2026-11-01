package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "offers")
public class Offer extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    private String imageUrl;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private OfferStatus status = OfferStatus.ACTIVE;
}
