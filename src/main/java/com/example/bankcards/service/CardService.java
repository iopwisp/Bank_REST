package com.example.bankcards.service;

import com.example.bankcards.dto.CardDTO;
import com.example.bankcards.entity.Card;
import com.example.bankcards.entity.CardStatus;
import com.example.bankcards.entity.User;
import com.example.bankcards.exception.AccessDeniedException;
import com.example.bankcards.exception.ResourceNotFoundException;
import com.example.bankcards.repository.CardRepository;
import com.example.bankcards.repository.UserRepository;
import com.example.bankcards.security.service.EncryptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class CardService {

    private final CardRepository cardRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;

    @Value("${app.card.expiration-years}")
    private int expirationYears;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public CardDTO.Response createCard(CardDTO.CreateRequest request) {
        log.info("Creating card for user: {}", request.getUserId());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String cardNumber = generateCardNumber();
        String cvv = generateCVV();

        Card card = Card.build()
                .cardNumber(encryptionService.encrypt(cardNumber))
                .cardHolder(request.getCardHolder())
                .expirationDate(LocalDate.now().plusYears(expirationYears))
                .cvv(encryptionService.encrypt(cvv))
                .status(CardStatus.ACTIVE)
                .balance(request.getInitialBalance())
                .user(user)
                .build();

        card = cardRepository.save(card);
        log.info("Card created successfully with ID: {}", card.getId());

        return mapToResponse(card, cardNumber);
    }

    @Transactional(readOnly = true)
    public Page<CardDTO.Response> getUserCards(Long userId, Pageable pageable) {
        log.debug("Fetching cards for user: {}", userId);
        return cardRepository.findByUserId(userId, pageable)
                .map(card -> mapToResponse(card, null));
    }

    @Transactional(readOnly = true)
    public CardDTO.Response getCardById(Long cardId, Long userId, boolean isAdmin) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        if (!isAdmin && !card.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to view this card");
        }

        return mapToResponse(card, null);
    }

    @Transactional
    public CardDTO.Response updateCardStatus(Long cardId, CardDTO.UpdateRequest request,
                                             Long userId, boolean isAdmin) {
        log.info("Updating card status: {} to {}", cardId, request.getStatus());

        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        if (!isAdmin && !card.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to modify this card");
        }

        card.setStatus(request.getStatus());
        card = cardRepository.save(card);

        log.info("Card status updated successfully: {}", cardId);
        return mapToResponse(card, null);
    }

    @Transactional
    public void deleteCard(Long cardId, boolean isAdmin) {
        log.info("Deleting card: {}", cardId);

        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        if (!isAdmin) {
            throw new AccessDeniedException("Only admins can delete cards");
        }

        if (card.getBalance().compareTo(java.math.BigDecimal.ZERO) > 0) {
            throw new InvalidOperationException("Cannot delete card with non-zero balance");
        }

        cardRepository.delete(card);
        log.info("Card deleted successfully: {}", cardId);
    }

    @Transactional
    public CardDTO.Response requestCardBlock(Long cardId, Long userId, CardDTO.BlockRequest request) {
        log.info("User {} requesting block for card {}: {}", userId, cardId, request.getReason());

        Card card = cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        card.setStatus(CardStatus.BLOCKED);
        card = cardRepository.save(card);

        log.info("Card blocked successfully: {}", cardId);
        return mapToResponse(card, null);
    }

    private CardDTO.Response mapToResponse(Card card, String decryptedCardNumber) {
        String maskedNumber;
        if (decryptedCardNumber != null) {
            maskedNumber = encryptionService.maskCardNumber(decryptedCardNumber);
        } else {
            String cardNumber = encryptionService.decrypt(card.getCardNumber());
            maskedNumber = encryptionService.maskCardNumber(cardNumber);
        }

        return CardDTO.Response.builder()
                .id(card.getId())
                .maskedCardNumber(maskedNumber)
                .cardHolder(card.getCardHolder())
                .expirationDate(card.getExpirationDate())
                .status(card.getStatus())
                .balance(card.getBalance())
                .userId(card.getUser().getId())
                .createdAt(card.getCreatedAt())
                .updatedAt(card.getUpdatedAt())
                .build();
    }

    private String generateCardNumber() {
        String bin = "4000";
        StringBuilder cardNumber = new StringBuilder(bin);

        for (int i = 0; i < 12; i++) {
            cardNumber.append(random.nextInt(10));
        }

        return cardNumber.toString();
    }

    private String generateCVV() {
        return String.format("%03d", random.nextInt(1000));
    }
}
