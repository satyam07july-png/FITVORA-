import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
  const socket = io("http://localhost:5000");

  socket.on("orderUpdated", () => {
    fetchOrders();
  });

  return () => socket.disconnect();
}, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const steps = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered"
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h2>Your Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => {

        const currentStep = steps.indexOf(order.status);
        const progress = ((currentStep + 1) / steps.length) * 100;

        return (
          <div
            key={order._id}
            style={{
              background: "#111",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px"
            }}
          >
            <h3>Order ID: {order._id.slice(-6)}</h3>
            <p>Total: ₹{order.total}</p>

            {/* 🔥 PROGRESS BAR */}
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  height: "10px",
                  background: "#333",
                  borderRadius: "20px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "#00ff88",
                    transition: "0.5s ease"
                  }}
                />
              </div>
               <p style={{ color: "#aaa" }}>
                   Estimated Delivery: {order.estimatedTime}
              </p>
              <p style={{ marginTop: "10px", color: "#00ff88" }}>
                {order.status}
              </p>

              <div style={{ marginTop:"20px", position:"relative", height:"5px", background:"#333" }}>
                   <div
                    style={{
                    width:`${progress}%`,
                    height:"100%",
                    background:"#00ff88",
                    transition:"1s ease"
                 }}
                />
            </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}