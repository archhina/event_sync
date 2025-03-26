package org.example.controllers;

import org.example.config.SecretSigningKey;
import org.example.models.Event;
import org.example.models.Invite;
import org.example.models.User;
import org.example.service.EventService;
import org.example.service.InviteService;
import org.example.service.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/events")
public class EventController {

    private EventService service;
    private InviteService inviteService;
    private SecretSigningKey secretSigningKey;

    public EventController(EventService service, InviteService inviteService, SecretSigningKey secretSigningKey) {
        this.service = service;
        this.inviteService = inviteService;
        this.secretSigningKey = secretSigningKey;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createEvent(@RequestBody Event event, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(List.of("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        event.setHost(new User());
        event.getHost().setUserId(userId);
        Result<Event> result = service.saveEvent(event);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        Invite invite = new Invite();
        invite.setEvent(result.getPayload());
        invite.setUser(new User());
        invite.getUser().setUserId(userId);
        invite.setIsAccepted(true);
        Result<Invite> inviteResult = inviteService.create(invite);
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @GetMapping("/public")
    public ResponseEntity<Object> getPublicEvents() {
        return new ResponseEntity<>(service.getPublicEvents(), HttpStatus.OK);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Object> getEventById(@PathVariable Long eventId) {
        Result<Event> result = service.getEventById(eventId);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Object> updateEvent(@PathVariable Long eventId, @RequestBody Event event, @RequestHeader("Authorization") String jwt) {
        if (eventId != event.getEventId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(List.of("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        Result<Event> existingEvent = service.getEventById(eventId);
        if (existingEvent.getHttpStatus() == HttpStatus.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!existingEvent.getPayload().getHost().getUserId().equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Result<Event> result = service.saveEvent(event);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Object> deleteEvent(@PathVariable Long eventId, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(List.of("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        Result<Event> existingEvent = service.getEventById(eventId);
        if (existingEvent.getHttpStatus() == HttpStatus.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!existingEvent.getPayload().getHost().getUserId().equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Result<Event> result = service.delete(eventId);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
    }
}
