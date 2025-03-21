package org.example.data;

import org.example.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByIsPrivateFalse();

    Event findByEventId(Long eventId);
}
