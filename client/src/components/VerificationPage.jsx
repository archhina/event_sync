import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const VerificationPage = ({ setMessage, setMessageStyle }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {

    const code = searchParams.get("code")

    if (!code) {
      setMessage("Invalid or missing verification code.")
      setMessageStyle("alert-error")
      return navigate("/")
    }

    fetch("http://localhost:8080/api/users/verify?code=" + code)
      .then((res) => {
        if (res.ok) {
          return res.json().then((user) => {
            setMessage("Your account has been verified please login!")
            setMessageStyle("alert-success")
            navigate("/")
          })
        } 
      })
  }, [])

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center text-lg font-medium">
        Verifying your account...
      </div>
    </div>
  )
}

export default VerificationPage
