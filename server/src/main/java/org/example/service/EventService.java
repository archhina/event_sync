package org.example.service;

import org.example.data.EventRepository;
import org.example.data.InviteRepository;
import org.example.models.Event;
import org.example.models.Invite;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private EventRepository eventRepository;
    private InviteRepository inviteRepository;

    public EventService(EventRepository eventRepository, InviteRepository inviteRepository) {
        this.eventRepository = eventRepository;
        this.inviteRepository = inviteRepository;
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

    public Result<Event> saveEvent(Event event) {
        Result<Event> result = validate(event);
        if (result.isSuccess()) {
            eventRepository.save(event);
            result.setPayload(event);
        }
        return result;
    }


//    public Result<Event> update(Event event) {
//        Result<Event> result = validate(event);
//        if (result.isSuccess()) {
//            eventRepository.save(event);
//            result.setPayload(event);
//        }
//        return result;
//    }

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

    public Object getAcceptedEvents(Long userId) {
        return inviteRepository.findByUser_UserIdAndIsAcceptedTrue(userId)
                .stream()
                .map(Invite::getEvent)
                .collect(Collectors.toList());
    }
}
