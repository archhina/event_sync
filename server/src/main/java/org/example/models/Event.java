package org.example.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "Events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @ManyToOne
    @JoinColumn(name = "hostId", nullable = false)
    private User host;

    private String eventName;

    private String eventDescription;

    private String eventImage;

    private LocalDateTime eventDate;

    private String eventLocation;

    private boolean isPrivate;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Event() {
    }

    public Event(Long eventId, User host, String eventName, String eventDescription, String eventImage, LocalDateTime eventDate, String eventLocation, boolean isPrivate, LocalDateTime createdAt) {
        this.eventId = eventId;
        this.host = host;
        this.eventName = eventName;
        this.eventDescription = eventDescription;
        this.eventImage = eventImage;
        this.eventDate = eventDate;
        this.eventLocation = eventLocation;
        this.isPrivate = isPrivate;
        this.createdAt = createdAt;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public User getHost() {
        return host;
    }

    public void setHost(User host) {
        this.host = host;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public String getEventImage() {
        return eventImage;
    }

    public void setEventImage(String eventImage) {
        this.eventImage = eventImage;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventLocation() {
        return eventLocation;
    }

    public void setEventLocation(String eventLocation) {
        this.eventLocation = eventLocation;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
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
        Event event = (Event) o;
        return eventId == event.eventId && isPrivate == event.isPrivate && Objects.equals(host, event.host) && Objects.equals(eventName, event.eventName) && Objects.equals(eventDescription, event.eventDescription) && Objects.equals(eventImage, event.eventImage) && Objects.equals(eventDate, event.eventDate) && Objects.equals(eventLocation, event.eventLocation) && Objects.equals(createdAt, event.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, host, eventName, eventDescription, eventImage, eventDate, eventLocation, isPrivate, createdAt);
    }
}
