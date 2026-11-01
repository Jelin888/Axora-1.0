package com.axora.repository;

import com.axora.entity.Payment;
import com.axora.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPayer_IdOrReceiver_Id(Long payerId, Long receiverId);
    Optional<Payment> findByTransactionId(String transactionId);
    long countByStatus(PaymentStatus status);
}
