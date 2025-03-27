import { jwtDecode } from "jwt-decode"
import { useState } from "react"


const AccountModal = ({ setOpen, setLoggedInUser, setMessage, setMessageStyle}) => {

  const [login, setLogin] = useState(true)

  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (evt) => {
    setUser({
      ...user,
      [evt.target.name]: evt.target.value
    })
  }

  const handleRegister = (evt) => {
    evt.preventDefault()
    setMessage("")
    fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(res => {
      if (res.ok) {
        setMessage("User created! Check your email inbox (including spam) for verification.")
        setMessageStyle("alert-success")
        setOpen(false)
      } else {
        res.json().then(errs => {
          setMessage("Registration failed: " + errs.join(", "))
          setMessageStyle("alert-error")
          setOpen(false)
        })
      }
    })
    setLoading(true)
  }

  const handleLogin = (evt) => {
    evt.preventDefault()
    setMessage("")
    fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(res => {
      if (res.ok) {
        return res.json().then(fetchedUser => {
          const user = jwtDecode(fetchedUser.jwt)
          user.jwt = fetchedUser.jwt
          setLoggedInUser(user)
          localStorage.setItem("loggedInUser", JSON.stringify(user))
          setMessage("Login successful!")
          setMessageStyle("alert-success")
          setOpen(false)
        })
      } else {
        res.json().then(errs => {
          setMessage("Login failed: " + errs.join(", "))
          setMessageStyle("alert-error")
          setOpen(false)
        })
      }
    })
    setLoading(true)
  }


  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="relative w-full flex items-center justify-center">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0" disabled={loading} onClick={() => setOpen(false)}>✕</button>
          <h2 className="text-xl font-bold mb-4 text-center">{login ? `User Login`: "User Registration"}</h2>
        </div>

        <form onSubmit={login ? handleLogin : handleRegister}>
          <div className="mb-2">
            <label className="label">Email</label>
            <input type="email" name="email" className="input validator input-bordered w-full" placeholder="email@example.com" onChange={handleChange} required/>
            <div className="validator-hint">Enter valid email address</div>
          </div>
          <div className="mb-2">
            <label className="label">Password</label>
            <input type="password" name="password" className="input validator input-bordered w-full" placeholder="••••••••" onChange={handleChange} required minLength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
            <p className="validator-hint">
              Must be more than 8 characters, including
              <br/>At least one number
              <br/>At least one lowercase letter
              <br/>At least one uppercase letter
            </p>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading} >{loading ? <span className="loading loading-bars loading-sm"></span> : login ? "Login" : "Sign Up"}</button>
          
        </form>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center mt-4">
        {login ? "Not registered?" : "Already have an account?"} <button onClick={() => setLogin(!login)} className="text-blue-700 cursor-pointer hover:underline dark:text-blue-500">{login ? "Register" : "Login"}</button>
        </div>
      </div>
    </div>
  )
}

export default AccountModal
