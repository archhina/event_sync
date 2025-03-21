import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import EventCard from "./EventCard"
import ItemModal from "./ItemModal"

const EventPage = ({ loggedInUser }) => {

  const [event, setEvent] = useState({})

  const [open, setOpen] = useState(false)

  const [itemType, setItemType] = useState("Item")

  const [mains, setMains] = useState([])
  const [sides, setSides] = useState([])
  const [others, setOthers] = useState([])

  const params = useParams()

  useEffect(() => {
    fetch("http://localhost:8080/api/events/" + params.eventId)
      .then(res => {
        if (res.ok) {
          res.json().then(event => setEvent(event))
        } else {
          res.json().then(err => console.error(err))
        }
      })
  }, [params.eventId])

  const handleModal = (type) => {
    setItemType(type)
    setOpen(true)
  }

  return (
    <div className="">
      {open && <ItemModal setOpen={setOpen} loggedInUser={loggedInUser} itemType={itemType} />}
      <div className="flex flex-col md:flex-row justify-around gap-6">
        <div className="w-full md:w-2/3"><EventCard event={event} /></div>
        <div className={`card lg:card-side w-full md:w-1/5 bg-base-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] my-6`}>
          <div className="card-body text-center p-[1.15rem]">
            <h2 className="card-title p-6 mx-auto w-fit pb-12 border-b">Host Contact Email:<br/>{event.host && event.host.email}</h2>
            <div className="card-actions justify-center">
              <button className="btn btn-success btn-wide my-5">Join Event</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 mt-6 mx-11">
        <div className="card bg-base-300 rounded-box grid h-32 grow relative">
          <div className="card-body">
            <h2 className="card-title text-center">Main Dishes : {event.main ? event.main: 0}</h2>
            <button className="btn btn-square btn-sm absolute top-5 right-5 text-lg" onClick={() => handleModal("Main Dish")}>+</button>
            {mains && mains.map(main => <p>{main}</p>)}
          </div>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="card bg-base-300 rounded-box grid h-32 grow relative">
          <div className="card-body">
            <h2 className="card-title text-center">Sides & Appetizers : {event.sides ? event.sides: 0}</h2>
            <button className="btn btn-square btn-sm absolute top-5 right-5 text-lg" onClick={() => handleModal("Side/Appetizer")} >+</button>
            {sides && sides.map(side => <p>{side}</p>)}
          </div>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="card bg-base-300 rounded-box grid h-32 grow relative">
          <div className="card-body">
            <h2 className="card-title text-center">Other : {event.other ? event.other: 0}</h2>
            <button className="btn btn-square btn-sm absolute top-5 right-5 text-lg" onClick={() => handleModal("Other")}>+</button>
            {others && others.map(other => <p>{other}</p>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventPage;
