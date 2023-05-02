import { useEffect, useState } from "react"
import PageTitle from '../../components/PageTitle'
import BusForm from "../../components/BusForm"
import { axiosInstance } from "../../helpers/axiosInstance"
import { useDispatch } from "react-redux"
import { hideLoading, showLoading } from "../../redux/alertSlice"
import { message, Table } from "antd"


const AdminBuses = () => {
const[showBusForm,setShowBusForm] = useState(false)
const [getAllBus,setGetAllBus] = useState([])
const[selectedbus,setSelectedBus] = useState(null)
const dispatch = useDispatch()

const getBus = async () => {
  try{
    dispatch(showLoading)
    const response = await axiosInstance.get('/api/buses/get-all-bus', {})
    console.log(response)
    dispatch(hideLoading)
    if(response.data.success){
      setGetAllBus(response.data.data)
    } else {
      message.error(response.data.message)
    }
  } catch(err){
    message.error(err.message)
  }
  
}

const deleteBus = async (id) => {
  try{
    dispatch(showLoading)
    const response = await axiosInstance.post('/api/buses/delete-bus', {
      _id:id
    })
    console.log(response)
    dispatch(hideLoading)
    if(response.data.success){
      message.success(response.data.message)
      setGetAllBus(response.data.data)
      getBus()
    } else {
      dispatch(hideLoading)
      message.error(response.data.message)
    }
  } catch(err){
    message.error(err.message)
  }
  
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Number",
    dataIndex: "number",
  },
  {
    title: "From",
    dataIndex: "from",
  },
  {
    title: "To",
    dataIndex: "to",
  },
  {
    title: "Journey Date",
    dataIndex: "journeyDate",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (action, record) => (
      <div className="d-flex gap-3">
        <i
          class="ri-delete-bin-line"
          onClick={() => deleteBus(record._id)}
        ></i>
        <i
          class="ri-pencil-line"
          onClick={() => {
            setSelectedBus(record)
            setShowBusForm(true)
          }}
        ></i>
      </div>
    ),
  },
];

useEffect(() => {
  getBus()
},[])
  return (
    <div>
       <div className="d-flex justify-content-between my-2">
        <PageTitle title="Buses" />
        <button className="primary-btn" onClick={() => setShowBusForm(true)}>
          Add Bus
        </button>
      </div>
      <Table columns={columns} dataSource={getAllBus} />
      {showBusForm && (
        <BusForm
          showBusForm={showBusForm}
          setShowBusForm={setShowBusForm}
          type={selectedbus ? 'edit' : 'add'}
          selectedbus={selectedbus}
          setSelectedBus={setSelectedBus}
          getData={getBus}
        />
      )}
    </div>
  )
}

export default AdminBuses
