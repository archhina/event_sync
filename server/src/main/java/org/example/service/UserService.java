package org.example.service;

import org.example.config.SecretSigningKey;
import org.example.data.UserRepository;
import org.example.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private EmailService emailService;
    private SecretSigningKey secretSigningKey;

    public UserService(UserRepository userRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public Result<User> createUser(User user) {
        Result<User> result = new Result<>();

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            result.addErrorMessage("Email is required", HttpStatus.BAD_REQUEST);
            return result;
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            result.addErrorMessage("Password is required", HttpStatus.BAD_REQUEST);
            return result;
        }
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            result.addErrorMessage("Email is already taken", HttpStatus.BAD_REQUEST);
            return result;
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        String code = UUID.randomUUID().toString();

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(hashedPassword);
        newUser.setVerificationCode(code);
        newUser.setImageUrl(user.getImageUrl());

        userRepository.save(newUser);

        emailService.sendVerificationEmail(user.getEmail(), code);
        result.setPayload(newUser);

        return result;
    }

    public Result<Boolean> verifyUser(String code) {
        Result<Boolean> result = new Result<>();
        User user = userRepository.findByVerificationCode(code);
        if (user == null) {
            result.addErrorMessage("Invalid verification code", HttpStatus.BAD_REQUEST);
            return result;
        }
        user.setVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);
        result.setPayload(true);
        return result;
    }

    public Result<User> findByEmail(String email) {
        Result<User> result = new Result<>();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            result.addErrorMessage("User not found", HttpStatus.NOT_FOUND);
        } else {
            result.setPayload(user);
        }
        return result;
    }


    public Result<User> updateUser(User user) {
        Result<User> result = new Result<>();
        userRepository.save(user);
        result.setPayload(user);
        return result;
    }

    public Result<User> deleteUser(Long userId) {
        Result<User> result = new Result<>();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            result.addErrorMessage("User not found", HttpStatus.NOT_FOUND);
            return result;
        }
        userRepository.delete(user);
        return result;
    }
}
