package org.example.service;

import org.example.data.EventRepository;
import org.example.models.Event;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getPublicEvents() {
        return eventRepository.findByIsPrivateFalse();
    }

    public Result<Event> getEventById(Long eventId) {
        Result<Event> result = new Result<>();
        Event event = eventRepository.findByEventId(eventId);
        if (event == null) {
            result.addErrorMessage("Event not found", HttpStatus.NOT_FOUND);
        } else {
            result.setPayload(event);
        }
        return result;
    }

    public Result<Event> createEvent(Event event) {
        Result<Event> result = validate(event);
        if (result.isSuccess()) {
            eventRepository.save(event);
            result.setPayload(event);
        }
        return result;
    }


    public Result<Event> update(Event event) {
        Result<Event> result = validate(event);
        if (result.isSuccess()) {
            eventRepository.save(event);
            result.setPayload(event);
        }
        return result;
    }

    private Result<Event> validate(Event event) {
        Result<Event> result = new Result<>();

        if (event == null) {
            result.addErrorMessage("Event cannot be null", HttpStatus.BAD_REQUEST);
            return result;
        }
        if (event.getHost().getUserId() == null || event.getHost().getUserId() < 0) {
            result.addErrorMessage("Host is required", HttpStatus.BAD_REQUEST);
        }
        if (event.getEventName() == null || event.getEventName().isBlank()) {
            result.addErrorMessage("Event name is required", HttpStatus.BAD_REQUEST);
        }
        if (event.getEventDate() == null) {
            result.addErrorMessage("Event date is required", HttpStatus.BAD_REQUEST);
        }
        if (event.getEventLocation() == null || event.getEventLocation().isBlank()) {
            result.addErrorMessage("Event location is required", HttpStatus.BAD_REQUEST);
        }
        if (event.getCreatedAt().isAfter(event.getEventDate())) {
            result.addErrorMessage("Event creation date cannot be after event date", HttpStatus.BAD_REQUEST);
        }
        return result;
    }
}
