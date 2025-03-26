package org.example.service;

import org.example.data.InviteRepository;
import org.example.models.Invite;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InviteService {

    private InviteRepository inviteRepository;

    public InviteService(InviteRepository inviteRepository) {
        this.inviteRepository = inviteRepository;
    }

    public Result<Invite> create(Invite invite) {
        Result<Invite> result = new Result<>();
        if (invite == null) {
            result.addErrorMessage("Invite cannot be null", HttpStatus.BAD_REQUEST);
            return result;
        }
        if (invite.getEvent() == null) {
            result.addErrorMessage("Event is required", HttpStatus.BAD_REQUEST);
            return result;
        }
        if (invite.getUser() == null) {
            result.addErrorMessage("User is required", HttpStatus.BAD_REQUEST);
            return result;
        }
        if (result.isSuccess()) {
            inviteRepository.save(invite);
            result.setPayload(invite);
        }
        return result;
    }

    public Result<Invite> findInviteById(Long inviteId) {
        Result<Invite> result = new Result<>();
        Invite invite = inviteRepository.findByInviteId(inviteId);
        if (invite == null) {
            result.addErrorMessage("Invite not found", HttpStatus.NOT_FOUND);
        } else {
            result.setPayload(invite);
        }
        return result;
    }

    public Result<Invite> delete(Long inviteId) {
        Result<Invite> result = new Result<>();
        if (!inviteRepository.existsById(inviteId)) {
            result.addErrorMessage("Invite not found", HttpStatus.NOT_FOUND);
            return result;
        }
        inviteRepository.deleteById(inviteId);
        return result;
    }

    public List<Invite> getAcceptedInvites(Long userId) {
        return inviteRepository.findByUser_UserIdAndIsAcceptedTrue(userId);
    }

    public List<Invite> getInvitesByUserIdAndNotAccepted(Long userId) {
        return inviteRepository.findByUser_UserIdAndIsAcceptedFalse(userId);
    }

    public Invite findUserIdAndEventId(Long userId, Long eventId) {
        return inviteRepository.findByUser_UserIdAndEvent_EventId(userId, eventId);
    }
}
