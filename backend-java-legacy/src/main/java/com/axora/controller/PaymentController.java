package com.axora.controller;

import com.axora.dto.CreatePaymentRequest;
import com.axora.dto.PaymentDTO;
import com.axora.exception.ApiResponse;
import com.axora.security.AxoraUserDetails;
import com.axora.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentDTO>> create(@AuthenticationPrincipal AxoraUserDetails principal,
                                                            @Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment initiated", paymentService.createPayment(principal.getUser(), request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> myPayments(@AuthenticationPrincipal AxoraUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success("OK", paymentService.getMyPayments(principal.getUser())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", paymentService.getById(id)));
    }

    @PutMapping("/{id}/mark-success")
    public ResponseEntity<ApiResponse<PaymentDTO>> markSuccess(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Payment marked successful", paymentService.markSuccess(id)));
    }
}
