import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AccountModal from './components/AccountModal'
import Alert from './components/Alert'
import DisplayEvents from './components/DisplayEvents'
import Sidebar from './components/Sidebar'
import EventForm from './components/EventForm'
import EventPage from './components/EventPage'
import InviteModal from './components/InviteModal'
import DisplayInvitations from './components/DisplayInvitations'

function App() {

  const [open, setOpen] = useState(false); // used to open account modal from navbar

  const [loggedInUser, setLoggedInUser] = useState(null);

  const [message, setMessage] = useState("") //used to display messages in alert component

  const [messageStyle, setMessageStyle] = useState("") // used to set the style of the alert component

  const [navMessage, setNavMessage] = useState("Public Events") // used to set the message in the navbar

  const [event, setEvent] = useState({}) // used to provide event data to navbar from eventpage

  const [openInvite, setOpenInvite] = useState(false) // used to open invite modal from navbar

  useEffect(() => {
    if (localStorage.getItem("loggedInUser")) {
      setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")))
    }
  }, [])

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar setNavMessage={setNavMessage} loggedInUser={loggedInUser} />
        <div className="flex-1 flex flex-col h-screen overflow-auto relative">
          <Navbar navMessage={navMessage} open={open} setOpen={setOpen} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setNavMessage={setNavMessage} event={event} setOpenInvite={setOpenInvite} />
          <div className='flex-1 overflow-auto p-4 mt-16'>
            {open && <AccountModal open={open} setOpen={setOpen} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle}/>}
            {openInvite && <InviteModal open={openInvite} setOpen={setOpenInvite} loggedInUser={loggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} event={event} />}
            <div className="fixed top-16 w-[calc(100%-16rem)] z-50">
              {message && <Alert message={message} setMessage={setMessage} messageStyle={messageStyle} setMessageStyle={setMessageStyle}/>}
            </div>
            <Routes>
              {/* Landing Page */}
              <Route path='/' element={<DisplayEvents loggedInUser={loggedInUser} />} />
              {/* Create Event */}
              <Route path='/create' element={ loggedInUser === null ?
							<Navigate to="/" /> : <EventForm loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} />} />
              {/* Edit Event */}
              <Route path='/edit/:eventId' element={ loggedInUser === null ?
							<Navigate to="/" /> : <EventForm loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} />} />
              {/* Event Page */}
              <Route path='/events/:eventId' element={<EventPage loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} event={event} setEvent={setEvent} />} />
              {/* MyEvents Page */}
              <Route path='/myevents' element={ loggedInUser === null ?
							<Navigate to="/" /> : <DisplayEvents loggedInUser={loggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} /> } />

              {/* Invitations Page */}
              <Route path='/invitations' element={ loggedInUser === null ?
              <Navigate to="/" /> : <DisplayInvitations loggedInUser={loggedInUser} /> } />

              {/* Default/NotFound Page */}
              <Route path='*' element={<h1>Not Found</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
