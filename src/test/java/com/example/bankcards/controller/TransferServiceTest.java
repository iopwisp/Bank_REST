//package com.example.bankcards.controller;
//
//import com.example.bankcards.dto.TransferDTO;
//import com.example.bankcards.entity.Card;
//import com.example.bankcards.entity.CardStatus;
//import com.example.bankcards.entity.Transaction;
//import com.example.bankcards.entity.User;
//import com.example.bankcards.exception.InsufficientFundsException;
//import com.example.bankcards.exception.InvalidOperationException;
//import com.example.bankcards.exception.ResourceNotFoundException;
//import com.example.bankcards.repository.CardRepository;
//import com.example.bankcards.repository.TransactionRepository;
//import com.example.bankcards.security.service.EncryptionService;
//import com.example.bankcards.service.TransferService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.util.Optional;
//
//import static com.example.bankcards.entity.CardStatus.*;
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class TransferServiceTest {
//
//    @Mock
//    private CardRepository cardRepository;
//
//    @Mock
//    private  TransactionRepository transactionRepository;
//
//    @Mock
//    private EncryptionService encryptionService;
//
//    @InjectMocks
//    private TransferService transferService;
//
//    private Card fromCard;
//    private Card toCard;
//
//    @BeforeEach
//    void setUp() {
//        User user = User.builder()
//                .id(1L)
//                .username("test_user")
//                .build();
//
//        fromCard = Card.builder()
//                .id(1L)
//                .cardNumber("encrypted1")
//                .balance(new BigDecimal("1000.00"))
//                .status(ACTIVE)
//                .expirationDate(LocalDate.now().plusYears(2))
//                .user(user)
//                .build();
//
//        toCard = Card.builder()
//                .id(2L)
//                .cardNumber("encrypted2")
//                .balance(new BigDecimal("500.00"))
//                .status(CardStatus.ACTIVE)
//                .expirationDate(LocalDate.now().plusYears(2))
//                .user(user)
//                .build();
//    }
//
//    @Test
//    void testSuccessfulTransfer() {
//        TransferDTO.Request request = new TransferDTO.Request(
//                1L, 2L, new BigDecimal("100.00"), "Test transfer"
//        );
//
//        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(fromCard));
//        when(cardRepository.findByIdAndUserId(2L, 1L)).thenReturn(Optional.of(toCard));
//        when(transactionRepository.save(any(Transaction.class)))
//                .thenAnswer(invocation -> {
//                    Transaction t = invocation.getArgument(0);
//                    t.setId(1L);
//                    return t;
//                });
//        when(encryptionService.decrypt(anyString())).thenReturn("4000123456789012");
//        when(encryptionService.maskCardNumber(anyString())).thenReturn("**** **** **** 9012");
//
//        TransferDTO.Response response = transferService.transferBetweenOwnCards(request, 1L);
//
//        assertNotNull(response);
//        assertEquals(new BigDecimal("900.00"), fromCard.getBalance());
//        assertEquals(new BigDecimal("600.00"), toCard.getBalance());
//        verify(cardRepository, times(2)).save(any(Card.class));
//        verify(transactionRepository, times(1)).save(any(Transaction.class));
//    }
//
//    @Test
//    void testTransferToSameCard() {
//        TransferDTO.Request request = new TransferDTO.Request(
//                1L, 1L, new BigDecimal("100.00"), "Test"
//        );
//
//        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(fromCard));
//
//        assertThrows(InvalidOperationException.class, () ->
//                transferService.transferBetweenOwnCards(request, 1L));
//    }
//
//    @Test
//    void testInsufficientFunds() {
//        TransferDTO.Request request = new TransferDTO.Request(
//                1L, 2L, new BigDecimal("2000.00"), "Test"
//        );
//
//        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(fromCard));
//        when(cardRepository.findByIdAndUserId(2L, 1L)).thenReturn(Optional.of(toCard));
//
//        assertThrows(InsufficientFundsException.class, () ->
//                transferService.transferBetweenOwnCards(request, 1L));
//    }
//
//    @Test
//    void testTransferFromBlockedCard() {
//        fromCard.setStatus(CardStatus.BLOCKED);
//        TransferDTO.Request request = new TransferDTO.Request(
//                1L, 2L, new BigDecimal("100.00"), "Test"
//        );
//
//        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(fromCard));
//        when(cardRepository.findByIdAndUserId(2L, 1L)).thenReturn(Optional.of(toCard));
//
//        assertThrows(InvalidOperationException.class, () ->
//                transferService.transferBetweenOwnCards(request, 1L));
//    }
//
//    @Test
//    void testTransferToNonExistentCard() {
//        TransferDTO.Request request = new TransferDTO.Request(
//                1L, 999L, new BigDecimal("100.00"), "Test"
//        );
//
//        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(fromCard));
//        when(cardRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());
//
//        assertThrows(ResourceNotFoundException.class, () ->
//                transferService.transferBetweenOwnCards(request, 1L));
//    }
//}