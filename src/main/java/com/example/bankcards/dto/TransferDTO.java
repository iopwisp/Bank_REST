package com.example.bankcards.dto;

import com.example.bankcards.entity.TransactionStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransferDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotNull(message = "Source card ID is required")
        private Long fromCardId;

        @NotNull(message = "Destination card ID is required")
        private Long toCardId;

        @NotNull(message = "Amount is required")
        @Digits(integer = 13, fraction = 2)
        private BigDecimal amount;

        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long transactionId;
        private Long fromCardId;
        private String fromCardMasked;
        private Long toCardId;
        private String toCardMasked;
        private BigDecimal amount;
        private TransactionStatus status;
        private String description;
        private LocalDateTime createdAt;
    }
}
