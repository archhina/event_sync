import React from "react"

const ConfirmModal = ({ setOpen, onConfirm, message = "Are you sure?" }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button aria-label="Close" onClick={() => setOpen(false)} className="btn btn-sm btn-square btn-outline btn-error absolute right-4 top-4">✕</button>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Confirm Action
        </h2>
        <p className="text-center text-base border-b pb-6 px-4 whitespace-pre-line">{message}</p>
        <div className="flex justify-center gap-3 pt-4 w-3/4 mx-auto">
          <button className="btn btn-error btn-outline" onClick={() => {
             onConfirm()
             setOpen(false)
            }}>
            Yes, Confirm
          </button>
          <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
