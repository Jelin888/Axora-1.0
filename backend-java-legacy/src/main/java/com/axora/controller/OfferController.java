package com.axora.controller;

import com.axora.dto.OfferDTO;
import com.axora.exception.ApiResponse;
import com.axora.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @GetMapping("/api/offers")
    public ResponseEntity<ApiResponse<List<OfferDTO>>> activeOffers() {
        return ResponseEntity.ok(ApiResponse.success("OK", offerService.getActiveOffers()));
    }

    @PostMapping("/api/admin/offers")
    public ResponseEntity<ApiResponse<OfferDTO>> create(@RequestBody OfferDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Offer created", offerService.create(dto)));
    }

    @GetMapping("/api/admin/offers")
    public ResponseEntity<ApiResponse<List<OfferDTO>>> all() {
        return ResponseEntity.ok(ApiResponse.success("OK", offerService.getAll()));
    }

    @PutMapping("/api/admin/offers/{id}")
    public ResponseEntity<ApiResponse<OfferDTO>> update(@PathVariable Long id, @RequestBody OfferDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Offer updated", offerService.update(id, dto)));
    }

    @DeleteMapping("/api/admin/offers/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        offerService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Offer deleted", null));
    }
}
