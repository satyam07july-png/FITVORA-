import { useState, useEffect } from "react";
import "./App.css";

export default function Profile() {

  const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const savedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const savedAddresses =
      JSON.parse(localStorage.getItem("addresses")) || [];

    setOrders(savedOrders);
    setAddresses(savedAddresses);
  }, []);

  const deleteAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  return (
    <div className="profile-container">
    <button className="logout-btn" onClick={logout}>
  Logout
</button>
      <h1>My Profile</h1>

      {/* ================= ORDERS ================= */}
      <div className="profile-section">
        <h2>My Orders</h2>

        {orders.length === 0 && <p>No orders yet.</p>}

        {orders.map(order => (
          <div key={order.id} className="order-card">
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>

            <div className="order-items">
              {order.items.map(item => (
                <p key={item.id}>
                  {item.name} x {item.qty}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADDRESSES ================= */}
      <div className="profile-section">
        <h2>Saved Addresses</h2>

        {addresses.length === 0 && <p>No saved addresses.</p>}

        {addresses.map((addr, index) => (
          <div key={index} className="address-card">
            <p>
              {addr.firstName} {addr.lastName} <br />
              {addr.house}, {addr.street} <br />
              {addr.city} - {addr.pincode} <br />
              📞 {addr.phone}
            </p>

            <button
              className="delete-btn"
              onClick={() => deleteAddress(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
