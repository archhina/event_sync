import { useState } from "react";

const ItemModal = ({ setOpen, fetchItems, loggedInUser, setLoggedInUser, itemType, setMessage, setMessageStyle, eventId}) => {

  const [item, setItem] = useState({
    itemName: "",
    itemCategory: itemType,
    event: {
      eventId: eventId
    }
  })

  const handleSubmit = (evt) => {
    evt.preventDefault()
    fetch("http://localhost:8080/api/item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": loggedInUser.jwt
      },
      body: JSON.stringify(item)
    })
      .then(res => {
        if (res.ok) {
          setOpen(false)
          setMessage("Item added successfully")
          setMessageStyle("alert-success")
          fetchItems()
        } else if (res.status === 401 || res.status === 403) {
          setLoggedInUser(null)
          localStorage.clear("loggedInUser")
          setMessage("Session expired. Please log in again.")
          setMessageStyle("alert-error")
        } else {
          res.text().then(err => {
            setMessage("Item creation failed: " + err)
            setMessageStyle("alert-error")
            setOpen(false)
          })
        }
      })
  }

  const handleChange = (evt) => {
    setItem({
      ...item,
      [evt.target.name]: evt.target.value
    })
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button aria-label="Close" onClick={() => setOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-center mb-6">{`Add ` + itemType}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <div className="w-3/4">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input id="email" type="email" value={loggedInUser.email} disabled className="input input-bordered w-full opacity-50 cursor-not-allowed" />
          </div>
          <div className="w-3/4">
            <label className="label" htmlFor="item">
              <span className="label-text">{itemType}</span>
            </label>
            <input id="itemName" type="text" name="itemName" placeholder="Item Name" className="input input-bordered w-full" value={item.itemName} onChange={handleChange}/>
          </div>
          <div className="flex justify-center gap-3 pt-4 w-3/4">
            <button type="submit" className="btn btn-primary">
              Add Item
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
