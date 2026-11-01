package com.axora.service;

import com.axora.dto.CreatePaymentRequest;
import com.axora.dto.PaymentDTO;
import com.axora.entity.User;

import java.util.List;

public interface PaymentService {
    PaymentDTO createPayment(User payer, CreatePaymentRequest request);
    List<PaymentDTO> getMyPayments(User currentUser);
    PaymentDTO getById(Long id);
    PaymentDTO markSuccess(Long id);
}
