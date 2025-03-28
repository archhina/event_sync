import { useState } from "react"
import ConfirmModal from "../components/ConfirmModal"
import { useNavigate } from "react-router-dom"

const ProfilePage = ({ loggedInUser, setLoggedInUser, setMessage, setMessageStyle }) => {

  const [imageUrl, setImageUrl] = useState(loggedInUser.imageUrl || "https://img.icons8.com/ios-glyphs/60/user--v1.png")
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()


  const handleUpdate = (evt) => {
    evt.preventDefault()
    const updatedUser = { ...loggedInUser, imageUrl: imageUrl }
    fetch(`http://localhost:8080/api/users`, {
      method: "PUT",
      headers: {
        Authorization: loggedInUser.jwt,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedUser)
    })
    .then(res => {
      if (res.ok) {
        setLoggedInUser(updatedUser)
        setMessage("Profile picture updated successfully")
        setMessageStyle("alert-success")
        navigate("/")
      }
      else if (res.status === 401 || res.status === 403) {
        setMessage("Session expired. Please log in again.")
        setMessageStyle("alert-error")
        setLoggedInUser(null)
        localStorage.removeItem("loggedInUser")
        navigate("/")
      }
    })
  }

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/users/${loggedInUser.userId}`, {
      method: "DELETE",
      headers: {
        Authorization: loggedInUser.jwt,
      }
    })
    .then(res => {
      if (res.ok) {
        setMessage("Account deleted successfully")
        setMessageStyle("alert-success")
        setLoggedInUser(null)
        localStorage.removeItem("loggedInUser")
        navigate("/")
      } else if (res.status === 401 || res.status === 403) {
        setMessage("Session expired. Please log in again.")
        setMessageStyle("alert-error")
        setLoggedInUser(null)
        localStorage.removeItem("loggedInUser")
        navigate("/")
      } 
    })
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 rounded-lg drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] bg-base-100">
      {open && <ConfirmModal setOpen={setOpen} onConfirm={handleDelete} message={`Are you sure you want to PERMANENTLY delete your account along with it's data?\n\nThis action cannot be undone.`} />}
      <h2 className="text-3xl font-semibold text-center mb-6">User Profile</h2>
      
      <div className="flex justify-center mb-6">
        <img src={imageUrl} alt="Profile" className="rounded-full w-32 h-32 object-cover border-2 border-white" />
      </div>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4 items-center">
        <div className="w-3/4">
          <label htmlFor="email" className="label"><span className="label-text">Email</span></label>
          <input id="email" type="email" className="input input-bordered w-full opacity-50 cursor-not-allowed" value={loggedInUser.email} disabled/>
        </div>
        <div className="w-3/4"> 
          <label htmlFor="imageUrl" className="label"><span className="label-text">Profile Picture URL</span></label> 
          <input id="imageUrl" type="text" className="input input-bordered w-full" placeholder="https://img.icons8.com/ios-glyphs/60/user--v1.png" value={imageUrl} onChange={(evt) => setImageUrl(evt.target.value)} />
        </div>
        <div className="flex justify-between w-3/4 pt-4">
          <button type="submit" className="btn btn-primary btn-outline">Update Picture</button>
          <button type="button" className="btn btn-error btn-outline" onClick={() => setOpen(true)}>Delete Account</button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePage
