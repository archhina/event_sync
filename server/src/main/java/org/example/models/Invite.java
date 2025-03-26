package org.example.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "Invites")
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inviteId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private boolean isAccepted = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Invite() {
    }

    public Invite(Long inviteId, User user, Event event, boolean isAccepted, LocalDateTime createdAt) {
        this.inviteId = inviteId;
        this.user = user;
        this.event = event;
        this.isAccepted = isAccepted;
        this.createdAt = createdAt;
    }

    public Long getInviteId() {
        return inviteId;
    }

    public void setInviteId(Long inviteId) {
        this.inviteId = inviteId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isAccepted() {
        return isAccepted;
    }

    public void setIsAccepted(boolean accepted) {
        isAccepted = accepted;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Invite invite = (Invite) o;
        return isAccepted == invite.isAccepted && Objects.equals(inviteId, invite.inviteId) && Objects.equals(user, invite.user) && Objects.equals(event, invite.event) && Objects.equals(createdAt, invite.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(inviteId, user, event, isAccepted, createdAt);
    }
}
