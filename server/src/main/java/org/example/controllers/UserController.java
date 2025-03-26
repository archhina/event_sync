package org.example.controllers;

import io.jsonwebtoken.Jwts;
import org.example.config.SecretSigningKey;
import org.example.models.User;
import org.example.service.Result;
import org.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService service;
    private PasswordEncoder passwordEncoder;
    private SecretSigningKey secretSigningKey;

    public UserController(UserService service, SecretSigningKey secretSigningKey, PasswordEncoder passwordEncoder) {
        this.service = service;
        this.secretSigningKey = secretSigningKey;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> create(@RequestBody User user) {
        Result<User> result = service.createUser(user);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @GetMapping("/verify")
    public ResponseEntity<Object> verify(@RequestParam String code) {
        Result<Boolean> result = service.verifyUser(code);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(result.getPayload() ,HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User user) {
        Result<User> result = service.findByEmail(user.getEmail());
        if (result.isSuccess()) {
            if (!result.getPayload().isVerified()) {
                return new ResponseEntity<>(List.of("User is not verified"), HttpStatus.UNAUTHORIZED);
            }
            if (passwordEncoder.matches(user.getPassword(), result.getPayload().getPassword())) {
                String jwtString = secretSigningKey.createJwt(result.getPayload().getUserId(), result.getPayload().getEmail(), result.getPayload().getImageUrl());
                Map<String, String> jwtMap = new HashMap<>();
                jwtMap.put("jwt", jwtString);

                return new ResponseEntity<>(jwtMap, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(List.of("Invalid Password"), HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping
    public ResponseEntity<Object> update(@RequestBody User user, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (!userId.equals(user.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Result<User> existingUser = service.findByEmail(user.getEmail());
        User updatedUser = existingUser.getPayload();
        updatedUser.setImageUrl(user.getImageUrl());

        Result<User> result = service.updateUser(updatedUser);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Object> delete(@PathVariable Long userId, @RequestHeader("Authorization") String jwt) {
        Long authUserId = secretSigningKey.getUserId(jwt);
        if (authUserId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (!authUserId.equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Result<User> result = service.deleteUser(userId);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
