package org.example.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class SecretSigningKey {

    private SecretKey key;

    public SecretSigningKey() {
        key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    public String createJwt(Long userId, String email) {
        return Jwts.builder()
                .claim("userId", userId)
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(getKey())
                .compact();
    }

    public Long getUserId(String jwt) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build().parseClaimsJws(jwt);
            return Long.valueOf(claims.getBody().get("userId").toString());
        } catch (Exception e) {
            return null;
        }
    }

    public SecretKey getKey() {
        return key;
    }
}
