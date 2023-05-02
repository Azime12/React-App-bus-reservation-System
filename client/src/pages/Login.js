import { Form, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/alertSlice"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onFinish = async (value) => {
    try{
      dispatch(showLoading())
      const response = await axios.post('/api/users/login', value)
      dispatch(hideLoading())
      if(response.data.success){
        message.success(response.data.message)
        localStorage.setItem('token', response.data.data)
        navigate('/')
      } else {
        dispatch(hideLoading())
        message.error(response.data.error)
      }
    } catch(err){
      dispatch(hideLoading())
      message.error(err.message)
    }
  }
  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
    <div className="w-400 card p-3">
      <h1 className="text-lg">SheyBus - Login</h1>
      <hr />
      <Form layout="vertical" onFinish={onFinish}>
       
        <Form.Item label="Email" name="email">
          <input type="text" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <input type="password" />
        </Form.Item>
        <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/register">Click Here To Register</Link>
            <button className="secondary-btn" type="submit">
              Login
            </button>
          </div>
      </Form>
    </div>
  </div>
  )
}

export default Login
