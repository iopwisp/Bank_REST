package com.example.bankcards.dto;

import com.example.bankcards.entity.CardStatus;
import jakarta.validation.constraints.*;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CardDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Card holder name is required")
        private String cardHolder;

        private Long userId;

        @DecimalMin(value = "0.0", message = "Initial balance must be non-negative")
        @Digits(integer = 13, fraction = 2)
        private BigDecimal initialBalance = BigDecimal.ZERO;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotNull(message = "Status is required")
        private CardStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String maskedCardNumber;
        private String cardHolder;
        private LocalDate expirationDate;
        private CardStatus status;
        private BigDecimal balance;
        private Long userId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlockRequest {
        @NotBlank(message = "Reason is required")
        @Size(max = 500, message = "Reason must not exceed 500 characters")
        private String reason;
    }
}
