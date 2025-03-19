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
                return new ResponseEntity<>("User is not verified", HttpStatus.UNAUTHORIZED);
            }
            if (passwordEncoder.matches(user.getPassword(), result.getPayload().getPassword())) {
                String jwtString = Jwts.builder()
                        .claim("userId", result.getPayload().getUserId())
                        .claim("email", result.getPayload().getEmail())
                        .setIssuedAt(new Date())
                        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                        .signWith(secretSigningKey.getKey())
                        .compact();
                Map<String, String> jwtMap = new HashMap<>();
                jwtMap.put("jwt", jwtString);

                return new ResponseEntity<>(jwtMap, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Invalid Password", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.NOT_FOUND);
        }
    }
}
