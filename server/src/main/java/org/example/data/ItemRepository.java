package org.example.data;

import org.example.models.Event;
import org.example.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByEvent_EventId(Long eventId);

    List<Item> findByUser_UserIdAndItemCategory(Long userId, String itemCategory);

    Item findByItemId(Long itemId);
}
