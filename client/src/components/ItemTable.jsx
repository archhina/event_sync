import React from "react"

const ItemTable = ({ items, itemType, handleModal, fetchItems, loggedInUser, setLoggedInUser, setMessage, setMessageStyle }) => {

  const handleDelete = (itemId) => {
    fetch("http://localhost:8080/api/item/" + itemId, {
      method: "DELETE",
      headers: {
        "Authorization": loggedInUser.jwt
      }
    })
      .then(res => {
        if (res.ok) {
          fetchItems()
          setMessage("Item deleted successfully")
          setMessageStyle("alert-success")
        } else if (res.status === 401 || res.status === 403) {
          setLoggedInUser(null)
          localStorage.clear("loggedInUser")
          setMessage("Session expired. Please log in again.")
          setMessageStyle("alert-error")
        } else {
          res.json().then(err => setMessage("Item creation failed: " + err.join(", ")))
          setMessageStyle("alert-error")
        }
      })
  }


  return (
    <div className="card bg-base-200 rounded-box grow relative">
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Email</th>
              <th>{itemType}</th>
              {loggedInUser && <th><button className="btn btn-square btn-sm btn-outline btn-success text-lg" onClick={() => handleModal(itemType)}>+</button></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.itemId} className="hover:bg-base-300">
                <th>{index + 1}</th>
                <td>{item.user.email}</td>
                <td>{item.itemName}</td>
                {loggedInUser && loggedInUser.email === item.user.email && <td><button className="btn btn-sm btn-square btn-outline btn-error" onClick={() => handleDelete(item.itemId)}>✕</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default ItemTable;
