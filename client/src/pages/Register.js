import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { hideLoading, showLoading } from "../redux/alertSlice"
import { useDispatch } from "react-redux";


const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onFinish = async (value) => {
    try {
      dispatch(showLoading())
      const response = await axios.post('/api/users/register',value)
      dispatch(hideLoading())
      if (response.data.success) {
        message.success(response.data.message);
        navigate('/login')
      } else {
        dispatch(hideLoading())
        message.error(response.data.message);
      }
    } catch (err){
      dispatch(hideLoading())
      message.error(err.message)
    }
  }
  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
    <div className="w-400 card p-3">
      <h1 className="text-lg">SheyBus - Register</h1>
      <hr />
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name">
          <input type="text" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <input type="text" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <input type="password" />
        </Form.Item>
        <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/login">Click Here To Login</Link>
            <button className="secondary-btn" type="submit">
              Register
            </button>
          </div>
      </Form>
    </div>
  </div>
  );
}

export default Register
