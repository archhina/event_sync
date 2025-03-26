import { useState } from "react"

const InviteModal = ({ setOpen, onInvite, loggedInUser, event, setMessage, setMessageStyle }) => {
  const [invite, setInvite] = useState({
    event: {
      eventId: event.eventId
    },
    user : {
      email: ""
    }
  })

  const handleChange = (evt) => {
    setInvite({...invite, user: { ...invite.user, [evt.target.name]: evt.target.value } })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    fetch("http://localhost:8080/api/invite", {
      method: "POST",
      headers: {
        "Authorization": loggedInUser.jwt,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(invite)
    })
    .then(res => {
      if (res.ok) {
        setMessage("Invite sent successfully")
        setMessageStyle("alert-success")
        setOpen(false)
        return res.json()
      } else if (res.status === 404) {
        setMessage("User not found")
        setMessageStyle("alert-error")
        setOpen(false)
      } else if (res.status === 401 || res.status === 403) {
        setMessage("Session expired. Please log in again.")
        setMessageStyle("alert-error")
        setOpen(false)
      } else {
        res.json().then(err => {
          setMessage("Failed to send invite: " + err)
          setMessageStyle("alert-error")
          setOpen(false)
        })
      }
    })
    setOpen(false)
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="btn btn-sm btn-square btn-outline btn-error absolute right-4 top-4"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-center mb-6">Invite User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <div className="w-3/4">
            <label className="label" htmlFor="email"><span className="label-text">Email Address</span></label>
            <input id="email" name="email" type="email" required placeholder="user@example.com" value={invite.user.email} onChange={handleChange} className="input input-bordered w-full"/>
          </div>
          <div className="flex justify-center gap-3 pt-4 w-3/4">
            <button type="submit" className="btn btn-primary btn-outline">Send Invite</button>
            <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;