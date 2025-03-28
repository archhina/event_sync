import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const EventForm = ({ loggedInUser, setLoggedInUser, setMessage, setMessageStyle }) => {

  const navigate = useNavigate()
  const params = useParams()

  const [event, setEvent] = useState({
    eventName: "", 
    eventDescription: "",
    eventImage: "",
    eventDate: "",
    eventLocation: "",
    isPrivate: false,
  })

  const handleChange = (evt) => {
    setEvent({
      ...event,
      [evt.target.name]: evt.target.type === "checkbox" ? evt.target.checked : evt.target.value
    })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()

    let method = "POST"
    let url = "http://localhost:8080/api/events/create"
    if (event.eventId) {
      method = "PUT"
      url = "http://localhost:8080/api/events/" + event.eventId
    }
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": loggedInUser.jwt
      },
      body: JSON.stringify(event)
    })
    .then(res => {
      if (res.ok) {
        navigate("/")
        setMessage("Success! Event created.")
        setMessageStyle("alert-success")
      } else if (res.status === 401 || res.status === 403) {
        setLoggedInUser(null)
        localStorage.clear("loggedInUser")
        setMessage("Session expired. Please log in again.")
        setMessageStyle("alert-error")
      } else {
        res.json().then(errs => {
          setMessage("Event creation failed: " + errs.join(", "))
          setMessageStyle("alert-error")
        })
      }
    })
  }

  useState(() => {
    if (params.eventId) {
      fetch("http://localhost:8080/api/events/" + params.eventId, {
        method: "GET",
        headers : {
          "Authorization": loggedInUser.jwt,
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        if (res.ok) {
          res.json().then(eventData => {
            setEvent({ ...eventData, isPrivate: eventData.private })
          })
        } else if (res.status === 401 || res.status === 403) {
          setLoggedInUser(null)
          localStorage.clear("loggedInUser")
          navigate("/")
          setMessage("Session expired. Please log in again.")
          setMessageStyle("alert-error")
        } else {
          res.json().then(err => console.error(err))
        }
      })
    } else {
      setEvent({
        eventName: "", 
        eventDescription: "",
        eventImage: "",
        eventDate: "",
        eventLocation: "",
        isPrivate: false,
      })
    }
  }, [params.eventId, loggedInUser])

  return (
    <div className="p-6 bg-base-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] rounded-lg max-w-lg mx-auto mt-6">

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Name</legend>
          <input type="text" name="eventName" className="input input-bordered w-full" placeholder="Enter event name" value={event.eventName} onChange={handleChange} required/>
          <p className="fieldset-label">Required</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Description</legend>
          <textarea name="eventDescription" className="textarea textarea-bordered w-full" placeholder="Enter event description (optional)" value={event.eventDescription} onChange={handleChange}/>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Image (URL)</legend>
          <input type="url" name="eventImage" className="input input-bordered w-full" placeholder="Enter image URL (optional)" value={event.eventImage} onChange={handleChange}/>
          <p className="fieldset-label">Optional</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Date & Time</legend>
          <input type="datetime-local" name="eventDate" className="input input-bordered w-full" value={event.eventDate} onChange={handleChange} required/>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Location</legend>
          <input type="text" name="eventLocation" className="input input-bordered w-full" placeholder="Enter event location" value={event.eventLocation} onChange={handleChange}/>
          <p className="fieldset-label">Optional</p>
        </fieldset>
        <fieldset className="fieldset">
        <legend className="fieldset-legend">Event Privacy:</legend>
          <label className="flex items-center" />
            <input type="checkbox" name="isPrivate" className="toggle" checked={event.isPrivate} onChange={handleChange}/>
        </fieldset>
        <button type="submit" className="btn btn-primary w-full">
          {params.eventId ? "Update Event": "Create Event"}
        </button>
      </form>
    </div>
  )
}

export default EventForm
