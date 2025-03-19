import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AccountModal from './components/AccountModal'
import Alert from './components/Alert'

function App() {

  const [open, setOpen] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState(null);

  const [message, setMessage] = useState("")

  const [messageStyle, setMessageStyle] = useState("")

  return (
    <Router>
      <Navbar open={open} setOpen={setOpen}/>
      {open && <AccountModal open={open} setOpen={setOpen} setLoggedInUser={setLoggedInUser} setMessage={setMessage} setMessageStyle={setMessageStyle}/>}
      {message && <Alert message={message} setMessage={setMessage} messageStyle={messageStyle} setMessageStyle={setMessageStyle}/>}
      <Routes>

      </Routes>
    </Router>
  )
}

export default App
