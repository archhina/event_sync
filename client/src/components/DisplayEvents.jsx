import { useEffect, useState } from "react"
import EventCard from "./EventCard";
import ConfirmModal from "./ConfirmModal";
import { useLocation } from "react-router-dom";

const DisplayEvents = ({ loggedInUser, setLoggedInUser, setMessage, setMessageStyle }) => {

  const [events, setEvents] = useState([])
  const [invites, setInvites] = useState([])
  const [hasFinishedFetching, setHasFinishedFetching] = useState(false)
  const location = useLocation()

  const fetchData = () => {
    {location.pathname !== "/myevents" ?
      fetch("http://localhost:8080/api/events/public")
        .then(res => res.json())
        .then(fetchedEvents => {
          setEvents(fetchedEvents)
          setHasFinishedFetching(true)
        })
      :
      fetch("http://localhost:8080/api/invite/accepted", {
        method: "GET",
        headers: {
          Authorization: loggedInUser.jwt,
        },
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            setLoggedInUser(null);
            localStorage.clear("loggedInUser");
            setMessage("Session expired. Please log in again.");
            setMessageStyle("alert-error");
          }
          return res.json();
        })
        .then((fetchedInvites) => {
          setInvites(fetchedInvites);
          setHasFinishedFetching(true);
        })
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [location.pathname])

  if(events.length === 0 && invites.length === 0) {
    if (hasFinishedFetching) {
      return <p>No events found</p>
    } else {
      return <p>Loading...</p>
    }
  }

  return (
    <div>
      {location.pathname !== "/myevents" ?
      <div className="max-w-3/4 mx-auto px-4 py-8">
        {events.map(event => <EventCard key={event.eventId} event={event} cardStyle={"cursor-pointer hover:scale-101 transition duration-300 ease-in-out"} />)}
      </div>
      :
      <div className="max-w-3/4 mx-auto px-4 py-8">
        {invites.map(invite => <EventCard key={invite.event.eventId} inviteId={invite.inviteId} event={invite.event} loggedInUser={loggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} cardStyle={"cursor-pointer hover:scale-101 transition duration-300 ease-in-out"} fetchData={fetchData} />)}
      </div>
  }
    </div>
  )
};

export default DisplayEvents;
