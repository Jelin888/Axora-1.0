package com.axora.repository;

import com.axora.entity.Offer;
import com.axora.entity.OfferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByStatus(OfferStatus status);
}
