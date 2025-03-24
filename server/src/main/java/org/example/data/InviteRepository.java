package org.example.data;

import org.example.models.Invite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InviteRepository extends JpaRepository<Invite, Long> {

    List<Invite> findByUser_UserIdAndIsAcceptedTrue(Long userId);

    Invite findByInviteId(Long inviteId);
}
