package org.example.controllers;

import org.apache.tomcat.util.http.parser.Authorization;
import org.example.config.SecretSigningKey;
import org.example.models.Event;
import org.example.models.Item;
import org.example.models.User;
import org.example.service.ItemService;
import org.example.service.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/item")
public class ItemController {

    private ItemService service;
    private SecretSigningKey secretSigningKey;

    public ItemController(ItemService service, SecretSigningKey secretSigningKey) {
        this.service = service;
        this.secretSigningKey = secretSigningKey;
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Object> findByEventId(@PathVariable Long eventId) {
        return new ResponseEntity<>(service.findByEventId(eventId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Item item, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        item.setUser(new User());
        item.getUser().setUserId(userId);

        List<Item> userItems = service.findByUserIdAndItemCategory(userId, item.getItemCategory());
        if (!userItems.isEmpty()) {
            return new ResponseEntity<>(List.of("User is already bringing an item of this category"), HttpStatus.BAD_REQUEST);
        }
        Result<Item> result = service.create(item);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Object> delete(@PathVariable Long itemId, @RequestHeader("Authorization") String jwt) {
        Long userId = secretSigningKey.getUserId(jwt);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Result<Item> existingItem = service.findById(itemId);
        if (!existingItem.isSuccess()) {
            return new ResponseEntity<>(existingItem.getErrorMessages(), existingItem.getHttpStatus());
        }
        if (!existingItem.getPayload().getUser().getUserId().equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Result<Item> result = service.delete(itemId);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result.getErrorMessages(), result.getHttpStatus());
    }
}
