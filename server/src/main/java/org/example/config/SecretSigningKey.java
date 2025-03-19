package org.example.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class SecretSigningKey {

    private SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public SecretKey getKey() {
        return key;
    }
}
