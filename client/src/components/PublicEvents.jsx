import { useEffect, useState } from "react"
import EventCard from "./EventCard";

const PublicEvents = (props) => {

  const [events, setEvents] = useState([])
  const [hasFinishedFetching, setHasFinishedFetching] = useState(false)

  useEffect(() => {
    fetch("http://localhost:8080/api/events/public")
      .then(res => res.json())
      .then(fetchedEvents => {
        setHasFinishedFetching(true)
        setEvents(fetchedEvents)
      })
  }, [])

  if(events.length === 0) {
    if (hasFinishedFetching) {
      return <p>No events found</p>
    } else {
      return <p>Loading...</p>
    }
  }

  return (
    <div className="mx-32">
      {events.map(event => <EventCard key={event.eventId} event={event} cardStyle={"cursor-pointer hover:scale-101 transition duration-300 ease-in-out"} />)}
    </div>
  )
};

export default PublicEvents;
