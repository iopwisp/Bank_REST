package com.example.bankcards.service;

import com.example.bankcards.dto.TransferDTO;
import com.example.bankcards.entity.Card;
import com.example.bankcards.entity.Transaction;
import com.example.bankcards.entity.TransactionStatus;
import com.example.bankcards.repository.CardRepository;
import com.example.bankcards.repository.TransactionRepository;
import com.example.bankcards.security.service.EncryptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferService {

    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;
    private final EncryptionService encryptionService;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public TransferDTO.Response transferBetweenOwnCards(TransferDTO.Request request, Long userId) {
        log.info("Processing transfer for user {}: {} to {}, amount: {}",
                userId, request.getFromCardId(), request.getToCardId(), request.getAmount());

        // Validate cards belong to user
        Card fromCard = cardRepository.findByIdAndUserId(request.getFromCardId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Source card not found"));

        Card toCard = cardRepository.findByIdAndUserId(request.getToCardId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination card not found"));

        if (fromCard.getId().equals(toCard.getId())) {
            throw new InvalidOperationException("Cannot transfer to the same card");
        }

        if (!fromCard.isActive()) {
            throw new InvalidOperationException("Source card is not active");
        }

        if (!toCard.isActive()) {
            throw new InvalidOperationException("Destination card is not active");
        }

        if (fromCard.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds on source card");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidOperationException("Transfer amount must be positive");
        }

        fromCard.setBalance(fromCard.getBalance().subtract(request.getAmount()));
        toCard.setBalance(toCard.getBalance().add(request.getAmount()));

        cardRepository.save(fromCard);
        cardRepository.save(toCard);

        Transaction transaction = Transaction.builder()
                .fromCard(fromCard)
                .toCard(toCard)
                .amount(request.getAmount())
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .build();

        transaction = transactionRepository.save(transaction);

        log.info("Transfer completed successfully. Transaction ID: {}", transaction.getId());

        return mapToResponse(transaction);
    }

    private TransferDTO.Response mapToResponse(Transaction transaction) {
        String fromCardNumber = encryptionService.decrypt(transaction.getFromCard().getCardNumber());
        String toCardNumber = encryptionService.decrypt(transaction.getToCard().getCardNumber());

        return TransferDTO.Response.builder()
                .transactionId(transaction.getId())
                .fromCardId(transaction.getFromCard().getId())
                .fromCardMasked(encryptionService.maskCardNumber(fromCardNumber))
                .toCardId(transaction.getToCard().getId())
                .toCardMasked(encryptionService.maskCardNumber(toCardNumber))
                .amount(transaction.getAmount())
                .status(TransactionStatus.COMPLETED)
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
