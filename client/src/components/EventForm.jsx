import { useState } from "react"
import { useNavigate } from "react-router-dom";

const EventForm = ({ loggedInUser, setLoggedInUser, setMessage, setMessageStyle }) => {
  const navigate = useNavigate()

  const [event, setEvent] = useState({
    eventName: "",
    eventDescription: "",
    eventImage: "",
    eventDate: "",
    eventLocation: "",
    private: false,
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
    if (event.id) {
      method = "PUT"
      url = "http://localhost:8080/api/events/" + event.id
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

  return (
    <div className="p-6 bg-base-100 shadow-md rounded-lg max-w-lg mx-auto">

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Name</legend>
          <input
            type="text"
            name="eventName"
            className="input input-bordered w-full"
            placeholder="Enter event name"
            value={event.eventName}
            onChange={handleChange}
            required
          />
          <p className="fieldset-label">Required</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Description</legend>
          <textarea
            name="eventDescription"
            className="textarea textarea-bordered w-full"
            placeholder="Enter event description (optional)"
            value={event.eventDescription}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Image (URL)</legend>
          <input
            type="url"
            name="eventImage"
            className="input input-bordered w-full"
            placeholder="Enter image URL (optional)"
            value={event.eventImage}
            onChange={handleChange}
          />
          <p className="fieldset-label">Optional</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Date & Time</legend>
          <input
            type="datetime-local"
            name="eventDate"
            className="input input-bordered w-full"
            value={event.eventDate}
            onChange={handleChange}
            required
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Event Location</legend>
          <input
            type="text"
            name="eventLocation"
            className="input input-bordered w-full"
            placeholder="Enter event location"
            value={event.eventLocation}
            onChange={handleChange}
          />
          <p className="fieldset-label">Optional</p>
        </fieldset>
        <fieldset className="fieldset">
        <legend className="fieldset-legend">Event Privacy:</legend>
          <label className="flex items-center" />          <input
              type="checkbox"
              name="private"
              className="toggle"
              checked={event.private}
              onChange={handleChange}
            />
        </fieldset>
        <button type="submit" className="btn btn-primary w-full">
          Create Event
        </button>
      </form>
    </div>
  )
};

export default EventForm;
