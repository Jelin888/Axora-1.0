package com.axora.service.impl;

import com.axora.dto.CreatePaymentRequest;
import com.axora.dto.PaymentDTO;
import com.axora.entity.*;
import com.axora.exception.ResourceNotFoundException;
import com.axora.repository.*;
import com.axora.service.NotificationService;
import com.axora.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final String AXORA_UPI_ID = "axora@upi";

    private PaymentDTO toDto(Payment p) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(p.getId());
        dto.setTransactionId(p.getTransactionId());
        dto.setProjectId(p.getProject().getId());
        dto.setProjectTitle(p.getProject().getTitle());
        dto.setPayerName(p.getPayer().getFullName());
        dto.setReceiverName(p.getReceiver().getFullName());
        dto.setAmount(p.getAmount());
        dto.setStatus(p.getStatus());
        dto.setCreatedAt(p.getCreatedAt());

        // Safe UPI deep-link (no banking credentials stored)
        String note = URLEncoder.encode("AXORA Payment - " + p.getProject().getTitle(), StandardCharsets.UTF_8);
        String upiUrl = String.format("upi://pay?pa=%s&pn=AXORA&am=%s&cu=INR&tn=%s",
                AXORA_UPI_ID, p.getAmount().toPlainString(), note);
        dto.setUpiIntentUrl(upiUrl);
        return dto;
    }

    @Override
    public PaymentDTO createPayment(User payer, CreatePaymentRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        Payment payment = new Payment();
        payment.setTransactionId("TXN" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());
        payment.setProject(project);
        if (request.getMilestoneId() != null) {
            Milestone milestone = milestoneRepository.findById(request.getMilestoneId())
                    .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));
            payment.setMilestone(milestone);
        }
        payment.setPayer(payer);
        payment.setReceiver(receiver);
        payment.setAmount(request.getAmount());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setUpiId(request.getUpiId());
        paymentRepository.save(payment);

        return toDto(payment);
    }

    @Override
    public List<PaymentDTO> getMyPayments(User currentUser) {
        return paymentRepository.findByPayer_IdOrReceiver_Id(currentUser.getId(), currentUser.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public PaymentDTO getById(Long id) {
        Payment p = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return toDto(p);
    }

    @Override
    public PaymentDTO markSuccess(Long id) {
        Payment p = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        p.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(p);

        if (p.getMilestone() != null) {
            Milestone m = p.getMilestone();
            m.setStatus(MilestoneStatus.PAID);
            milestoneRepository.save(m);
        }

        notificationService.notify(p.getReceiver().getId(),
                "Payment of ₹" + p.getAmount() + " received for \"" + p.getProject().getTitle() + "\"", "PAYMENT");

        return toDto(p);
    }
}
