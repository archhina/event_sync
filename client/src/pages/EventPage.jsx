import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import EventCard from "../components/EventCard"
import ItemModal from "../components/ItemModal"
import ItemTable from "../components/ItemTable"

const EventPage = ({ loggedInUser, setLoggedInUser, setMessage, setMessageStyle, event, setEvent }) => {

  const [open, setOpen] = useState(false)

  const [itemType, setItemType] = useState("Item")

  const [mains, setMains] = useState([])
  const [sides, setSides] = useState([])
  const [others, setOthers] = useState([])

  const [joined, setJoined] = useState(false)

  const [registered, setRegistered] = useState(0)

  const params = useParams()

  const [hasFinishedFetching, setHasFinishedFetching] = useState(false)
  
  const handleModal = (type) => {
    setItemType(type)
    {event.eventId && setOpen(true)}
  }

  const fetchRegistered = () => {
    fetch("http://localhost:8080/api/invite/accepted/" + params.eventId)
    .then(res => {
      if (res.ok) {
        res.text().then(amountRegistered => setRegistered(amountRegistered))
      } 
    })
  }

  const fetchItems = () => {
    fetch("http://localhost:8080/api/item/" + params.eventId)
    .then(res => {
      if (res.ok) {
        res.json()
        .then(items => {
          const newMains = []
          const newSides = []
          const newOthers = []
          items.forEach(item => {
            if (item.itemCategory === "Main Dish") {
              newMains.push(item)
            } else if (item.itemCategory === "Side/Appetizer") {
              newSides.push(item)
            } else {
              newOthers.push(item)
            }
          })
          setMains(newMains)
          setSides(newSides)
          setOthers(newOthers)
          fetchRegistered()
          if (!loggedInUser) {
            setHasFinishedFetching(true)
          }
        })
      } else {
        res.json().then(err => console.error(err))
      }
    })
  }

  useEffect(() => {
    fetch("http://localhost:8080/api/events/" + params.eventId)
      .then(res => {
        if (res.ok) {
          res.json().then(fetchedEvent => setEvent(fetchedEvent))
        } else {
          res.json().then(err => console.error(err))
        }
        fetchItems()
        checkIfJoined()
      })
  }, [params.eventId])

  const checkIfJoined = () => {
    if (loggedInUser) {
      fetch("http://localhost:8080/api/invite/" + params.eventId, {
        headers: {
          Authorization: loggedInUser.jwt,
        },
      })
        .then(res => {
          res.text().then(data => {
            if (data !== "Invite not found") {
              setJoined(true)
              setHasFinishedFetching(true)
            } else {
              setJoined(false)
              setHasFinishedFetching(true)
            }
          })
        })
    }
  }

  const handleJoin = () => {
    fetch(`http://localhost:8080/api/invite/${params.eventId}`, {
      method: "POST",
      headers: {
        Authorization: loggedInUser.jwt      }
    })
    .then(res => {
      if (res.ok) {
        checkIfJoined()
        setMessage("Successfully joined the event")
        setMessageStyle("alert-success")
      } else if (res.status === 401 || res.status === 403) {
        setLoggedInUser(null)
        localStorage.clear("loggedInUser")
        setMessage("Session expired. Please log in again.")
        setMessageStyle("alert-error")
      } else {
        res.json().then(err => {
          setMessage("Failed to join the event: " + err)
          setMessageStyle("alert-error")
        })
      }
    })
  }

  if (!hasFinishedFetching) {
    return null
  }

  return (
    <div className="">
      {open && <ItemModal setOpen={setOpen} fetchItems={fetchItems} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} itemType={itemType} setMessage={setMessage} setMessageStyle={setMessageStyle} eventId={event.eventId} />}
      <div className={"flex flex-col md:flex-row justify-around gap-6"}>
        <div className="w-full md:w-2/3"><EventCard event={event} /></div>
        <div className={`card lg:card-side w-full md:w-1/5 bg-base-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] my-6`}>
          <div className="card-body text-center p-[.75rem]">
            <div className="flex justify-center">
              <img
                src={event && event.host && event.host.imageUrl}
                alt="Host Profile"
                className="w-20 h-20 rounded-full border-2 border-primary object-cover"
              />
            </div>
            <h2 className="card-title text-base mx-auto w-fit">
              Host Contact Email:
              <br />
              {event && event.host && event.host.email}
            </h2>
            <div className="badge badge-soft badge-secondary text-sm md:text-base font-medium whitespace-normal h-8 -mb-3 mx-auto"><strong>Registered: </strong> {registered}</div>
            <div className="card-actions justify-center">
              <button className="btn btn-success btn-wide mt-4" disabled={joined || !loggedInUser} onClick={handleJoin}>{joined ? "Already Joined!": loggedInUser ? "Join Event!": "Login to Join!"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 mt-6 mx-11">
        <ItemTable items={mains} itemType={"Main Dish"} handleModal={handleModal} fetchItems={fetchItems} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} joined={joined} />
        <div className="divider lg:divider-horizontal"></div>
        <ItemTable items={sides} itemType={"Side/Appetizer"} handleModal={handleModal} fetchItems={fetchItems} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} joined={joined}/>
        <div className="divider lg:divider-horizontal"></div>
        <ItemTable items={others} itemType={"Other"} handleModal={handleModal} fetchItems={fetchItems} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} joined={joined}/>
      </div>
    </div>
  )
}

export default EventPage
