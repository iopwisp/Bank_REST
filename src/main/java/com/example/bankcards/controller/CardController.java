package com.example.bankcards.controller;

import com.example.bankcards.dto.CardDTO;
import com.example.bankcards.entity.Role;
import com.example.bankcards.entity.User;
import com.example.bankcards.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping
    @Operation(summary = "Get user cards", description = "Returns paginated list of user's cards")
    public ResponseEntity<Page<CardDTO.Response>> getUserCards(
            @AuthenticationPrincipal User user,
            @PageableDefault() Pageable pageable) {
        return ResponseEntity.ok(cardService.getUserCards(user.getId(), pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get card by ID", description = "Returns card details")
    public ResponseEntity<CardDTO.Response> getCardById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        boolean isAdmin = user.getRoles().contains(String.valueOf(Role.ADMIN));
        return ResponseEntity.ok(cardService.getCardById(id, user.getId(), isAdmin));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create card", description = "Creates a new card (Admin only)")
    public ResponseEntity<CardDTO.Response> createCard(
            @Valid @RequestBody CardDTO.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cardService.createCard(request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update card status", description = "Updates card status")
    public ResponseEntity<CardDTO.Response> updateCardStatus(
            @PathVariable Long id,
            @Valid @RequestBody CardDTO.UpdateRequest request,
            @AuthenticationPrincipal User user) {
        boolean isAdmin = user.getRoles().contains(String.valueOf(Role.ADMIN));
        return ResponseEntity.ok(
                cardService.updateCardStatus(id, request, user.getId(), isAdmin));
    }

    @PostMapping("/{id}/block")
    @Operation(summary = "Request card block", description = "User requests to block their card")
    public ResponseEntity<CardDTO.Response> requestCardBlock(
            @PathVariable Long id,
            @Valid @RequestBody CardDTO.BlockRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                cardService.requestCardBlock(id, user.getId(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete card", description = "Deletes a card (Admin only)")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        cardService.deleteCard(id, true);
        return ResponseEntity.noContent().build();
    }
}
