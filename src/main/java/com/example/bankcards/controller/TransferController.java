package com.example.bankcards.controller;

import com.example.bankcards.dto.TransferDTO;
import com.example.bankcards.entity.User;
import com.example.bankcards.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transfer")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @PostMapping
    @Operation(summary = "Transfer between own cards",
            description = "Transfers money between user's own cards")
    public ResponseEntity<TransferDTO.Response> transfer(
            @Valid @RequestBody TransferDTO.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                transferService.transferBetweenOwnCards(request, user.getId()));
    }
}
