import { useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"

const PublicRoute = ({children}) => {
  const navigate = useNavigate()
  useEffect(() => {
    if(localStorage.getItem('token')){
      navigate('/')
    } else {
      navigate('/login')
    }
  },[])
  return (
    <div>
        {children}
    </div>
  )
}

export default PublicRoute
