import { Col, message, Modal, Row, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import { axiosInstance } from "../helpers/axiosInstance";
import { hideLoading, showLoading } from "../redux/alertSlice";
import StripeCheckout from "react-stripe-checkout";
import moment from "moment";
import { useReactToPrint } from "react-to-print";


const Bookings = () => {
  const dispatch = useDispatch();
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState(null);
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-bookings-by-user-id",
        {}
      );
      dispatch(hideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.user,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => {
        return seats.join(", ");
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              setSelectedBookings(record);
              setShowPrintModal(true);
            }}
          >
            Print Ticket
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <div className="mt-2">
        <Table dataSource={bookings} columns={columns} />
      </div>

      {showPrintModal && (
        <Modal  title="Print Ticket" onCancel=
        {() => {
          setShowPrintModal(false);
          setSelectedBookings(null);
        }}
        visible={showPrintModal}
        okText="Print"
        onOk={handlePrint}>
             <div className="d-flex flex-column p-5" ref={componentRef}>
            <p>Bus : {selectedBookings.name}</p>
            <p>
              {selectedBookings.from} - {selectedBookings.to}
            </p>
            <hr />
            <p>
              <span>Journey Date:</span>{" "}
              {moment(selectedBookings.journeyDate).format("DD-MM-YYYY")}
            </p>
            <p>
              <span>Journey Time:</span> {selectedBookings.departure}
            </p>
            <hr />
            <p>
              <span>Seat Numbers:</span> <br />
              {selectedBookings.seats.join(',')}
            </p>
            <hr />
            <p>
              <span>Total Amount:</span>{" "}
              {selectedBookings.fare * selectedBookings.seats.length} /-
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Bookings;
