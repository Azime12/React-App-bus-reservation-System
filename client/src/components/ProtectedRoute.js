import { message } from "antd"
import axios from "axios"
import { Children, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { SetUser } from "../redux/userSlice"
import { useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice"
import DefaultLayout from "./DefaultLayout"

const ProtectedRoute = ({children}) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate()
    const validateToken = async () => {
        try{
          dispatch(showLoading())
            const response = await axios.post(
                "/api/users/get-user-by-id",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

          
            if(response.data.success){
              dispatch(hideLoading())
                dispatch(SetUser(response.data.data))
               
            } else {
               dispatch(hideLoading())
                localStorage.removeItem('token')
                message.error(response.data.message)
                navigate('/login')
            }
        } catch(err){
            dispatch(hideLoading())
            localStorage.removeItem('token')
                message.error(err.message)
            navigate('/login')
        }
    }
    useEffect(() => {
        if(localStorage.getItem('token')){
            validateToken()
        } else {
            navigate('/login')
        }
    },[])
  return (
    <div>
      {user && <DefaultLayout>{children}</DefaultLayout>}
    </div>
  )
}

export default ProtectedRoute
