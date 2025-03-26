package org.example.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String username;

    private String imageUrl = "https://img.icons8.com/ios-glyphs/60/user--v1.png";

    private String email;

    private String password;

    private boolean isVerified = false;

    private String verificationCode;

    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {
    }

    public User(Long userId, String username, String imageUrl, String email, String password, boolean isVerified, String verificationCode, LocalDateTime createdAt) {
        this.userId = userId;
        this.username = username;
        this.imageUrl = imageUrl;
        this.email = email;
        this.password = password;
        this.isVerified = isVerified;
        this.verificationCode = verificationCode;
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return isVerified == user.isVerified && Objects.equals(userId, user.userId) && Objects.equals(username, user.username) && Objects.equals(imageUrl, user.imageUrl) && Objects.equals(email, user.email) && Objects.equals(password, user.password) && Objects.equals(verificationCode, user.verificationCode) && Objects.equals(createdAt, user.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, username, imageUrl, email, password, isVerified, verificationCode, createdAt);
    }
}
