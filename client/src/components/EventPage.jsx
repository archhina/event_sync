import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import EventCard from "./EventCard"
import ItemModal from "./ItemModal"
import ItemTable from "./ItemTable"

const EventPage = ({ loggedInUser, setLoggedInUser, setMessage, setMessageStyle, event, setEvent }) => {

  // const [event, setEvent] = useState({})

  const [open, setOpen] = useState(false)

  const [itemType, setItemType] = useState("Item")

  const [mains, setMains] = useState([])
  const [sides, setSides] = useState([])
  const [others, setOthers] = useState([])

  const [joined, setJoined] = useState(false);

  const params = useParams()
  
  const handleModal = (type) => {
    setItemType(type)
    {event.eventId && setOpen(true)}
  }

  const fetchItems = () => {
    fetch("http://localhost:8080/api/item/" + params.eventId)
    .then(res => {
      if (res.ok) {
        res.json()
        .then(items => {
          const newMains = [];
          const newSides = [];
          const newOthers = [];
          items.forEach(item => {
            if (item.itemCategory === "Main Dish") {
              newMains.push(item);
            } else if (item.itemCategory === "Side/Appetizer") {
              newSides.push(item);
            } else {
              newOthers.push(item);
            }
          });
          setMains(newMains);
          setSides(newSides);
          setOthers(newOthers);
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
    fetch("http://localhost:8080/api/invite/" + params.eventId, {
      headers: {
        Authorization: loggedInUser.jwt,
      },
    })
      .then(res => {
        if (res.ok) {
          setJoined(true)
        }
      });
  };

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

  return (
    <div className="">
      {open && <ItemModal setOpen={setOpen} fetchItems={fetchItems} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} itemType={itemType} setMessage={setMessage} setMessageStyle={setMessageStyle} eventId={event.eventId} />}
      <div className="flex flex-col md:flex-row justify-around gap-6">
        <div className="w-full md:w-2/3"><EventCard event={event} /></div>
        <div className={`card lg:card-side w-full md:w-1/5 bg-base-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] my-6`}>
          <div className="card-body text-center p-[1.15rem]">
            <h2 className="card-title p-6 mx-auto w-fit pb-12 border-b">Host Contact Email:<br/>{event.host && event.host.email}</h2>
            <div className="card-actions justify-center">
              <button className={`btn btn-success btn-wide my-5`} disabled={joined} onClick={handleJoin}>{joined ? "Already Joined!" : "Join Event!" }</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 mt-6 mx-11">
        <ItemTable items={mains} itemType={"Main Dish"} handleModal={handleModal} fetchItems={fetchItems} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} />
            {/* <h2 className="card-title text-center">Main Dishes : {mains ? mains.length: 0}</h2>
            <button className="btn btn-square btn-sm absolute top-5 right-5 text-lg" onClick={() => handleModal("Main Dish")}>+</button>
            {mains && mains.map(item => <p>{item.itemName}</p>)}
          </div>
        </div> */}
        <div className="divider lg:divider-horizontal"></div>
        <ItemTable items={sides} itemType={"Side/Appetizer"} handleModal={handleModal} fetchItems={fetchItems} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} />
        <div className="divider lg:divider-horizontal"></div>
        <ItemTable items={others} itemType={"Other"} handleModal={handleModal} fetchItems={fetchItems} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} />
      </div>
    </div>
  )
}

export default EventPage;
