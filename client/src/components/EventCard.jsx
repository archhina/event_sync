import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import EventForm from "./EventForm";


const EventCard = ({ inviteId, invite, event, cardStyle, loggedInUser, setMessage, setMessageStyle, fetchData, onAccept, setShowInviteConfirm }) => {

  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    if (loggedInUser.email === event.host.email) {
      fetch(`http://localhost:8080/api/events/${event.eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": loggedInUser.jwt
        }
      })
      .then(res => {
        if (res.ok) {
          setMessage("Successfully removed event")
          setMessageStyle("alert-success")
          setShowConfirm(false)
          fetchData()
        } else {
          res.json().then(err => console.error(err))
          setMessage("Failed to remove event")
          setMessageStyle("alert-error")
          setShowConfirm(false)
        }
      })
    } else {
      fetch(`http://localhost:8080/api/invite/${inviteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": loggedInUser.jwt
        }
      })
      .then(res => {
        if (res.ok) {
          setMessage("Successfully removed event")
          setMessageStyle("alert-success")
          setShowConfirm(false)
          fetchData()
        } else {
          res.json().then(err => console.error(err))
          setMessage("Failed to remove event")
          setMessageStyle("alert-error")
          setShowConfirm(false)
        }
      })
    }
  }

  return (
    <>
      {showConfirm && <ConfirmModal setOpen={setShowConfirm} message="Are you sure you want to remove this event?" onConfirm={handleDelete}/>}
      <div className={`card lg:card-side bg-base-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] my-6 ${cardStyle && cardStyle} `} onClick={cardStyle === "disabled" ? undefined : () => navigate(`/events/${event.eventId}`)}>
        <figure className="w-full lg:w-1/3 h-64 overflow-hidden">
          <img
            src={event.eventImage ? event.eventImage: "https://plasticcontainercity.com/media/magefan_blog/title2.jpg"}
            alt="Event" />
        </figure>
        <div className="card-body p-[1.15rem]">
          <div className="flex justify-between border-b w-full">
            <h2 className="card-title pb-3">{event.eventName}</h2>
            {loggedInUser && (
              <div className="-mt-1">
                {onAccept ? (
                  <div className="flex gap-4">
                    <button
                      className="btn btn-sm btn-outline btn-success"
                      onClick={(evt) => {
                        evt.stopPropagation();
                        onAccept(invite.inviteId);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={(evt) => {
                        evt.stopPropagation();
                        setShowInviteConfirm(true);
                      }}
                    >
                      Decline
                    </button>
                  </div>
                ) : loggedInUser.email !== event.host.email ?
                  <button className="btn btn-sm btn-square btn-outline btn-error" onClick={(evt) => {
                    evt.stopPropagation()
                    setShowConfirm(true)
                  }}>✕</button>
                  :
                  <>
                    <button className="btn btn-sm btn-square btn-outline btn-warning mr-3" onClick={(evt) => {
                      evt.stopPropagation()
                      navigate(`/edit/${event.eventId}`)
                    }}>🖊</button>
                    <button className="btn btn-sm btn-square btn-outline btn-error" onClick={(evt) => {
                      evt.stopPropagation()
                      setShowConfirm(true)
                    }}>✕</button>
                  </>
                }
              </div>
              )
            }
          </div>
          <br />
          <p className="text-sm">{event.eventDescription || "No description available."}</p>
          <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-4 border-t">
            <div className="badge badge-primary text-sm md:text-base font-medium whitespace-normal h-8 mt-3"><strong>📅 Date:</strong> {new Date(event.eventDate).toLocaleString()}</div>
            <div className="badge badge-warning text-sm md:text-base font-medium whitespace-normal h-8 mt-3"><strong>📍 Location:</strong> {event.eventLocation}</div>
          </div>
          {/* <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div> */}
        </div>
      </div>
    </>
  )
};

export default EventCard;