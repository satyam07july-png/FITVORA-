import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setOrders(data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/admin/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    fetchOrders();
  };

  const totalRevenue = orders.reduce((a, b) => a + b.total, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div>Total Orders: {orders.length}</div>
        <div>Pending: {pendingOrders}</div>
        <div>Revenue: ₹{totalRevenue}</div>
      </div>

      {orders.map(order => (
        <div key={order._id} style={{ background:"#111", padding:"20px", marginBottom:"20px" }}>
          <h3>Order #{order._id.slice(-6)}</h3>
          <p>Total: ₹{order.total}</p>
          <p>Status: {order.status}</p>

          {["Confirmed","Preparing","Out for Delivery","Delivered"].map(step => (
            <button
              key={step}
              onClick={() => updateStatus(order._id, step)}
              style={{ marginRight:"10px" }}
            >
              {step}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}