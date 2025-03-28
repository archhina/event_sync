

const Alert = ({ message, setMessage, messageStyle, setMessageStyle }) => {

  return (
    <div role="alert" className={`alert alert-soft ${messageStyle} fixed top-18 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 flex items-center justify-center rounded-lg shadow-md`}>
      <div className="flex items-center text-center flex-grow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className="ml-4 flex-grow overflow-hidden">{message}</span>
      </div>
      <button onClick={() => {
        setMessage("")
        setMessageStyle("")
      }} className="btn btn-sm btn-square btn-outline btn-error ml-2 text-lg font-bold text-red-500">✕</button>
    </div>
  )
}

export default Alert
