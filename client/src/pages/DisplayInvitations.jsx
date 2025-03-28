import { useEffect, useState } from "react"
import EventCard from "../components/EventCard"
import ConfirmModal from "../components/ConfirmModal"

const DisplayInvitations = ({ loggedInUser, setLoggedInUser, setMessage, setMessageStyle }) => {

  const [invites, setInvites] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [hasFinishedFetching, setHasFinishedFetching] = useState(false)

  const fetchInvites = () => {
    fetch("http://localhost:8080/api/invite", {
      headers: {
        Authorization: loggedInUser.jwt,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          setLoggedInUser(null)
          localStorage.clear("loggedInUser")
          setMessage("Session expired. Please log in again.")
          setMessageStyle("alert-error")
        }
        return res.json()
      })
      .then((fetchedInvites) => {
        setInvites(fetchedInvites)
        setHasFinishedFetching(true)
      })
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

  if(invites.length === 0) {
    if (hasFinishedFetching) {
      return <p className="text-center">No pending invitations.</p>
    } else {
      return <p className="text-center">Loading...</p>
    }
  }

  return (
    <div className="max-w-3/4 mx-auto px-4 py-8">
      {showConfirm && <ConfirmModal setOpen={setShowConfirm} message="Are you sure you want to decline this invite?" onConfirm={handleDecline}/>}
      {invites.map((invite) => (
          <EventCard
            key={invite.event.eventId}
            loggedInUser={loggedInUser}
            setMessage={setMessage}
            setMessageStyle={setMessageStyle}
            invite={invite}
            event={invite.event}
            onAccept={handleAccept}
            setShowInviteConfirm={setShowConfirm}
            cardStyle={"disabled"}
          />
        ))}
    </div>
  )
}

export default DisplayInvitations
