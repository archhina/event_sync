package org.example.service;

import org.example.data.ItemRepository;
import org.example.models.Event;
import org.example.models.Item;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> findByEventId(Long eventId) {
        return itemRepository.findByEvent_EventId(eventId);
    }

    public List<Item> findByUserIdAndItemCategory(Long userId, String itemCategory) {
        return itemRepository.findByUser_UserIdAndItemCategory(userId, itemCategory);
    }

    public Result<Item> findById(Long itemId) {
        Result<Item> result = new Result<>();
        Item item = itemRepository.findByItemId(itemId);
        if (item == null) {
            result.addErrorMessage("Item not found", HttpStatus.NOT_FOUND);
        } else {
            result.setPayload(item);
        }
        return result;
    }

    public Result<Item> create(Item item) {
        Result<Item> result = new Result<>();
        if (item.getItemName() == null || item.getItemName().isBlank()) {
            result.addErrorMessage("Item name is required", HttpStatus.BAD_REQUEST);
            return result;
        }
        if (item.getEvent() == null) {
            result.addErrorMessage("Event is required", HttpStatus.BAD_REQUEST);
            return result;
        }
        if (result.isSuccess()) {
            itemRepository.save(item);
            result.setPayload(item);
        }
        return result;
    }

    public Result<Item> delete(Long itemId) {
        Result<Item> result = new Result<>();
        itemRepository.deleteById(itemId);
        return result;
    }
}
