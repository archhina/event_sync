import { useNavigate, useParams } from "react-router-dom";


const EventCard = ({ event, cardStyle }) => {

  const navigate = useNavigate()

  return (
    <div className={`card lg:card-side bg-base-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] my-6 ${cardStyle && cardStyle} `} onClick={() => navigate(`/events/${event.eventId}`)}>
      <figure className="w-full lg:w-1/3 h-64 overflow-hidden">
        <img
          src={event.eventImage ? event.eventImage: "https://plasticcontainercity.com/media/magefan_blog/title2.jpg"}
          alt="Event" />
      </figure>
      <div className="card-body p-[1.15rem]">
        <h2 className="card-title border-b pb-3 text-center">{event.eventName}</h2>
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
  )
};

export default EventCard;