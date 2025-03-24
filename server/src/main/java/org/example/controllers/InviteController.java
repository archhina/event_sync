package org.example.controllers;

import org.example.config.SecretSigningKey;
import org.example.models.Event;
import org.example.models.Invite;
import org.example.models.User;
import org.example.service.EventService;
import org.example.service.InviteService;
import org.example.service.Result;
import org.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/invite")
public class InviteController {

    private InviteService service;
    private EventService eventService;
    private UserService userService;
    private SecretSigningKey secretSigningKey;

    public InviteController(InviteService service, SecretSigningKey secretSigningKey, UserService userService, EventService eventService) {
        this.service = service;
        this.secretSigningKey = secretSigningKey;
        this.userService = userService;
        this.eventService = eventService;
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<Object> joinPublic(@PathVariable Long eventId, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Result<Event> eventExists = eventService.getEventById(eventId);
        if (!eventExists.isSuccess()) {
            return new ResponseEntity<>(eventExists.getErrorMessages(), eventExists.getHttpStatus());
        }
        Invite invite = new Invite();
        invite.setEvent(new Event());
        invite.getEvent().setEventId(eventId);
        invite.setUser(new User());
        invite.getUser().setUserId(userId);
        invite.setIsAccepted(true);
        Result<Invite> result = service.create(invite);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<Object> invitePrivate(@RequestBody Invite invite, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Result<Event> eventExists = eventService.getEventById(invite.getEvent().getEventId());
        if (!eventExists.isSuccess()) {
            return new ResponseEntity<>(eventExists.getErrorMessages(), eventExists.getHttpStatus());
        }
        Result<User> userExists = userService.findByEmail(invite.getUser().getEmail());
        if (!userExists.isSuccess()) {
            return new ResponseEntity<>(userExists.getErrorMessages(), userExists.getHttpStatus());
        }
        invite.setUser(userExists.getPayload());
        invite.setEvent(eventExists.getPayload());
//        invite.setIsAccepted(false);
        Result<Invite> result = service.create(invite);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/{inviteId}")
    public ResponseEntity<Object> acceptInvite(@PathVariable Long inviteId, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Result<Invite> inviteExists = service.findInviteById(inviteId);
        if (!inviteExists.isSuccess()) {
            return new ResponseEntity<>(inviteExists.getErrorMessages(), inviteExists.getHttpStatus());
        }
        if (!inviteExists.getPayload().getUser().getUserId().equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        inviteExists.getPayload().setIsAccepted(true);
        Result<Invite> result = service.create(inviteExists.getPayload());
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
    }

    @DeleteMapping("/{inviteId}")
    public ResponseEntity<Object> declineInvite(@PathVariable Long inviteId, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Result<Invite> inviteExists = service.findInviteById(inviteId);
        if (!inviteExists.isSuccess()) {
            return new ResponseEntity<>(inviteExists.getErrorMessages(), inviteExists.getHttpStatus());
        }
        if (!inviteExists.getPayload().getUser().getUserId().equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Result<Invite> result = service.delete(inviteId);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
    }
}
