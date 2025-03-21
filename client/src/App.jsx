import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AccountModal from './components/AccountModal'
import Alert from './components/Alert'
import PublicEvents from './components/PublicEvents'
import Sidebar from './components/Sidebar'
import EventForm from './components/EventForm'
import EventPage from './components/EventPage'

function App() {

  const [open, setOpen] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState(null);

  const [message, setMessage] = useState("")

  const [messageStyle, setMessageStyle] = useState("")

  const [navMessage, setNavMessage] = useState("Public Events")

  useEffect(() => {
    if (localStorage.getItem("loggedInUser")) {
      setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")))
    }
  }, [])

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar setNavMessage={setNavMessage} loggedInUser={loggedInUser} />
        <div className="flex-1 ml-64 flex flex-col h-screen overflow-auto relative">
          <Navbar navMessage={navMessage} open={open} setOpen={setOpen} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setNavMessage={setNavMessage} />
          <div className='flex-1 overflow-auto p-4 mt-16'>
            {open && <AccountModal open={open} setOpen={setOpen} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle}/>}
            <div className="fixed top-16 left-64 w-[calc(100%-16rem)] z-50">
              {message && <Alert message={message} setMessage={setMessage} messageStyle={messageStyle} setMessageStyle={setMessageStyle}/>}
            </div>
            <Routes>
              <Route path='/' element={<PublicEvents />} />
              <Route path='/create' element={ loggedInUser === null ?
							<Navigate to="/" /> : <EventForm loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle} />} />
              <Route path='/events/:eventId' element={<EventPage loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
              <Route path='/myevents' element={ loggedInUser === null ?
							<Navigate to="/" /> : <h1>My Events</h1>} />
              <Route path='*' element={<h1>Not Found</h1>} />
            </Routes>
          </div>
          
        </div>
      </div>
    </Router>
  )
}

export default App
