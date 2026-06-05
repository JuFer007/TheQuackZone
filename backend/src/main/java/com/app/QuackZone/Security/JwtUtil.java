package com.app.QuackZone.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "TheQuackZoneSuperSecretKeyForJWT2026MustBeAtLeast256BitsLong!!";
    private static final long EXPIRATION = 86400000L;

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(SECRET.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String correo, Long usuarioId) {
        return Jwts.builder()
                .subject(correo)
                .claim("usuarioId", usuarioId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey())
                .compact();
    }

    public String extractCorreo(String token) {
        return getClaims(token).getSubject();
    }

    public Long extractUsuarioId(String token) {
        return getClaims(token).get("usuarioId", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
