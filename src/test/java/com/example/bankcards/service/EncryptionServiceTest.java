//package com.example.bankcards.service;
//
//import com.example.bankcards.security.service.EncryptionService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//class EncryptionServiceTest {
//
//    private EncryptionService encryptionService;
//
//    @BeforeEach
//    void setUp() {
//        encryptionService = new EncryptionService(
//                "0123456789abcdef0123456789abcdef",
//                "AES/CBC/PKCS5Padding"
//        );
//    }
//
//    @Test
//    void testEncryptDecrypt() {
//        String original = "4000123456789012";
//        String encrypted = encryptionService.encrypt(original);
//        String decrypted = encryptionService.decrypt(encrypted);
//
//        assertNotEquals(original, encrypted);
//        assertEquals(original, decrypted);
//    }
//
//    @Test
//    void testMaskCardNumber() {
//        String cardNumber = "4000123456789012";
//        String masked = encryptionService.maskCardNumber(cardNumber);
//
//        assertEquals("**** **** **** 9012", masked);
//    }
//
//    @Test
//    void testMaskShortCardNumber() {
//        String cardNumber = "123";
//        String masked = encryptionService.maskCardNumber(cardNumber);
//
//        assertEquals("****", masked);
//    }
//
//    @Test
//    void testEncryptionIsConsistent() {
//        String original = "4000123456789012";
//        String encrypted1 = encryptionService.encrypt(original);
//        String encrypted2 = encryptionService.encrypt(original);
//
//        assertNotEquals(encrypted1, encrypted2);
//
//        assertEquals(original, encryptionService.decrypt(encrypted1));
//        assertEquals(original, encryptionService.decrypt(encrypted2));
//    }
//}