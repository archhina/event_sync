import { useEffect, useState } from "react"
import EventCard from "./EventCard";
import ConfirmModal from "./ConfirmModal";

const DisplayInvitations = ({ loggedInUser, setMessage, setMessageStyle }) => {

  const [invites, setInvites] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false)

  const fetchInvites = () => {
    fetch("http://localhost:8080/api/invite", {
      headers: {
        Authorization: loggedInUser.jwt,
      },
    })
      .then((res) => res.json())
      .then((data) => setInvites(data))
      .catch((err) => console.error("Failed to load invites:", err))
  }

  const handleAccept = (inviteId) => {
    fetch(`http://localhost:8080/api/invite/${inviteId}`, {
      method: "PUT",
      headers: {
        Authorization: loggedInUser.jwt,
      },
    }).then(() => fetchInvites())
  }

  const handleDecline = (inviteId) => {
    fetch(`http://localhost:8080/api/invite/${inviteId}`, {
      method: "DELETE",
      headers: {
        Authorization: loggedInUser.jwt,
      },
    }).then(() => fetchInvites())
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  return (
    <div className="max-w-3/4 mx-auto px-4 py-8">
      {showConfirm && <ConfirmModal setOpen={setShowConfirm} message="Are you sure you want to decline this invite?" onConfirm={handleDecline}/>}
      {invites ? (
        invites.map((invite) => (
          <EventCard
            key={invite.event.eventId}
            loggedInUser={loggedInUser}
            setMessage={setMessage}
            setMessageStyle={setMessageStyle}
            invite={invite}
            event={invite.event}
            onAccept={handleAccept}
            setShowInviteConfirm={setShowConfirm}
          />
        ))
      ) : (
        <p>No pending invitations.</p>
      )}
    </div>
  )
}

export default DisplayInvitations
