import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios.get("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.log(err));

    // Decode user from token (basic)
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);

  }, []);

  return (
    <div>
      <h2>Profile</h2>

      {user && (
        <div>
          <p>User ID: {user.id}</p>
        </div>
      )}

      <h3>Your Orders</h3>
      {orders.map(order => (
        <div key={order._id}>
          <p>Total: ₹{order.total}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;