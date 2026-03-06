import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState, useEffect } from "react";
import "./App.css";
import { FaInstagram } from "react-icons/fa";
import { SiZomato, SiSwiggy } from "react-icons/si";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Success from "./pages/Success.jsx";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";



export default function App() {

  /*======== use navigate ========== */
  const navigate = useNavigate();

  /**========  cart save ======= */
  const [cart, setCart] = useState([]);
  const [openIngredients, setOpenIngredients] = useState(null);
  useEffect(() => {
  const saved = localStorage.getItem("cart");

  if (saved) {
    setCart(JSON.parse(saved));
  }

}, []);
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);

  /* ---------------- HERO SLIDER ---------------- */

  const heroImages = ["/gym1.jpg", "/gym2.jpg", "/gym3.jpg"];
  const [currentImage, setCurrentImage] = useState(0);
  /* ---------------- MENU ---------------- */
const [menuItems, setMenuItems] = useState([])
const [loading, setLoading] = useState(true);
const [category, setCategory] = useState("all");

useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await fetch("http://10.75.97.163:5000/api/menu");
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Failed to fetch menu", error);
    } finally {
      setLoading(false);   // 🔥 important line
    }
  };

  fetchMenu();
}, []);

const filteredItems =
category === "all"
? menuItems
: menuItems.filter(item => item.category === category);

/*======== fechoder =========*/
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

/*======= socket .oi===========*/
useEffect(() => {

  const socket = io("http://10.75.97.163:5000");

  socket.on("orderUpdated", (order) => {
    console.log("Order updated:", order);
  });

  return () => {
    socket.disconnect();
  };

}, []);
  
/*==================== CUSTOMER DEATILS===========*/
 const [showCheckout, setShowCheckout] = useState(false);
 const [placingOrder, setPlacingOrder] = useState(false);

/* CUSTOMER STATE */
const [customer, setCustomer] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pincode: ""
});
const [savedAddresses, setSavedAddresses] = useState([]);
const [addressType, setAddressType] = useState("Home");
const saveAddress = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://10.75.97.163:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(customer)
    });

    if (res.ok) {
      alert("Address Saved ✅");
    } else {
      alert("Failed to save address ❌");
    }
  } catch (err) {
    console.error(err);
  }
};

const deleteAddress = (index) => {
  const updated = savedAddresses.filter((_, i) => i !== index);
  setSavedAddresses(updated);
  localStorage.setItem("addresses", JSON.stringify(updated));
};
const placeOrder = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch("http://10.75.97.163:5000/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart,
        total,
        customer
      })
    });

    if (res.ok) {

      alert("Order Placed Successfully (COD) ✅");

      setCart([]);
      setShowCheckout(false);

      navigate("/success");   // ✔ only success case

    } else {

      alert("Order Failed ❌");

    }

  } catch (err) {

    console.error(err);
    alert("Something went wrong ❌");

  }

};
  /* ---------------- CART ---------------- */
  const [showCart, setShowCart] = useState(false);
  const [promo, setPromo] = useState("");

  const addToCart = (item) => {
  const existing = cart.find(i => i._id === item._id);
    if (existing) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    setShowCart(true);
  };
 

/*==================== update quantity ===============*/
 const updateQty = (_id, type) => {
  setCart(prev =>
    prev
      .map(item => {
        if (item._id === _id) {
          if (type === "inc") {
            return { ...item, qty: item.qty + 1 };
          } else {
            if (item.qty === 1) return null;
            return { ...item, qty: item.qty - 1 };
          }
        }
        return item;
      })
      .filter(Boolean)
  );
};
  
    <div className="checkout-box">

      <div className="checkout-header">
        <h3>Delivery Details</h3>
        <button onClick={() => setShowCheckout(false)}>✖</button>
      </div>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="saved-section">
          <h4>Saved Addresses</h4>

          {savedAddresses.map((addr, index) => (
            <div className="saved-card" key={index}>
              <p>
                {addr.firstName} {addr.lastName} <br />
                {addr.house}, {addr.street} <br />
                {addr.city} - {addr.pincode} <br />
                📞 {addr.phone}
              </p>

              <div className="saved-actions">
                <button onClick={() => setCustomer(addr)}>
                  Use
                </button>
                <button onClick={() => deleteAddress(index)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Address Form */}
      <div className="checkout-form">

        <div className="row">
          <input
            placeholder="First Name"
            value={customer.firstName}
            onChange={(e) =>
              setCustomer({ ...customer, firstName: e.target.value })
            }
          />
          <input
            placeholder="Last Name"
            value={customer.lastName}
            onChange={(e) =>
              setCustomer({ ...customer, lastName: e.target.value })
            }
          />
        </div>

        <input
          placeholder="Phone"
          value={customer.phone}
          onChange={(e) =>
            setCustomer({ ...customer, phone: e.target.value })
          }
        />

        <input
          placeholder="House / Flat No"
          value={customer.house}
          onChange={(e) =>
            setCustomer({ ...customer, house: e.target.value })
          }
        />

        <input
          placeholder="Street / Area"
          value={customer.street}
          onChange={(e) =>
            setCustomer({ ...customer, street: e.target.value })
          }
        />

        <div className="row">
          <input
            placeholder="City"
            value={customer.city}
            onChange={(e) =>
              setCustomer({ ...customer, city: e.target.value })
            }
          />
          <input
            placeholder="Pincode"
            value={customer.pincode}
            onChange={(e) =>
              setCustomer({ ...customer, pincode: e.target.value })
            }
          />
          <input
  placeholder="Email"
  value={customer.email}
  onChange={(e) =>
    setCustomer({ ...customer, email: e.target.value })
  }
/>
        </div>

        <button className="save-btn" onClick={saveAddress}>
          Save Address
        </button>

      </div>

      <button className="payment-btn">
        Proceed to Payment
      </button>

    </div>
  


  /* ---------------- BILL ---------------- */

  const subtotal = cart.reduce((a, b) => a + b.price * b.qty, 0);
  const gst = subtotal * 0.05;
  const delivery = subtotal > 499 ? 0 : 40;
  const discount = promo === "FIT10" ? subtotal * 0.1 : 0;
  const total = subtotal + gst + delivery - discount;

  /* ---------------- UI ---------------- */
  return (
   <Routes>
      
      {/* HOME PAGE */}
      <Route
        path="/"
        element={
          <div className="container">

      {/* HEADER */}
      <div className="header">
        <h1>FITVORA</h1>
        <button className="cart-btn" onClick={() => setShowCart(true)}>
          🛒 {cart.reduce((a, b) => a + b.qty, 0)}
        </button>
      </div>

      {/* HERO */}
     <section className="hero">

  <div className="hero-overlay"></div>

  <div className="hero-content">

    <h1 className="hero-title">Fuel Your Fitness Journey</h1>

    <p className="hero-sub">
      High Protein Meals Crafted For Athletes & Fitness Lovers
    </p>

    <button
      className="hero-btn"
      onClick={() => window.scrollTo({top:600,behavior:"smooth"})}
    >
      Explore Meals
    </button>

  </div>

</section>
<section className="nutrition-section">

  <h2>Nutrition That Powers You</h2>

  <div className="nutrition-grid">

    <div className="nutrition-card">
      💪
      <h3>High Protein</h3>
      <p>Meals designed to build muscle and support recovery.</p>
    </div>

    <div className="nutrition-card">
      ⚡
      <h3>Balanced Macros</h3>
      <p>Perfect balance of protein, carbs, and calories.</p>
    </div>

    <div className="nutrition-card">
      🥗
      <h3>Fresh Ingredients</h3>
      <p>Only clean and fresh ingredients used.</p>
    </div>

    <div className="nutrition-card">
      🚀
      <h3>Performance Focused</h3>
      <p>Fuel for workouts and active lifestyles.</p>
    </div>

  </div>

</section>
<section className="transformation">

<h2>Real Fitness Results</h2>

<div className="transform-grid">

<div className="transform-card">
<img src="/trans1.jpg"/>
<p>Lost 8kg in 3 months with FITVORA meals</p>
</div>

<div className="transform-card">
<img src="/trans2.jpg"/>
<p>Lean muscle gain with high protein diet</p>
</div>

<div className="transform-card">
<img src="/trans3.jpg"/>
<p>Better energy & improved performance</p>
</div>

</div>

</section>
<section className="testimonials">

<h2>What Our Customers Say</h2>

<div className="testimonial-grid">

<div className="testimonial-card">
⭐⭐⭐⭐⭐
<p>Best healthy meals I’ve tried. Perfect for gym diet.</p>
<h4>Rohit Sharma</h4>
</div>

<div className="testimonial-card">
⭐⭐⭐⭐⭐
<p>Delicious and nutritious food. Highly recommended.</p>
<h4>Ankit Verma</h4>
</div>

<div className="testimonial-card">
⭐⭐⭐⭐⭐
<p>Finally healthy food that actually tastes good.</p>
<h4>Priya Singh</h4>
</div>

</div>

</section>
      {/* MENU */}
<section className="section">
  <h2>Our Menu</h2>
  <div className="menu-filter">

    <button onClick={() => setCategory("all")}>
      All
    </button>

    <button onClick={() => setCategory("veg")}>
      Veg
    </button>

    <button onClick={() => setCategory("nonveg")}>
      Non-Veg
    </button>

    <button onClick={() => setCategory("shake")}>
      Shakes
    </button>

  </div>
  
  {loading ? (
    <p style={{ textAlign: "center", marginTop: "20px" }}>
      Loading menu...
    </p>
  ) : menuItems.length === 0 ? (
    <p style={{ textAlign: "center", marginTop: "20px" }}>
      No items available
    </p>
  ) : (
    <div className="menu-grid">
      {filteredItems.map((item) => (
      <div className="menu-card" key={item._id}>

<img src={item.image} alt={item.name} />

<h3>{item.name}</h3>

<p className="price">₹{item.price}</p>

<small>
Protein: {item.protein} | Carbs: {item.carbs} | Calories: {item.calories} kcal
</small>

<button
className="ingredients-toggle"
onClick={() =>
setOpenIngredients(openIngredients === item._id ? null : item._id)
}
>
Ingredients {openIngredients === item._id ? "▲" : "▼"}
</button>

{openIngredients === item._id && (

<ul className="ingredients-list">

{item.ingredients?.map((ing, index) => (

<li key={index}>{ing}</li>

))}

</ul>

)}

<button onClick={() => addToCart(item)}>
Add to Cart
</button>

</div>
      ))}
    </div>
  )}
</section>

      <section className="contact-section">
  <div className="contact-wrapper">

    {/* LEFT SIDE */}
    <div className="contact-card-premium">
      <h2>Get In Touch</h2>
      <p className="contact-tagline">
        Premium Healthy Meals Delivered Fresh To Your Doorstep
      </p>

      <div className="contact-info-row">
        <span>📞</span>
        <p>+91 9217428485</p>
      </div>

      <div className="contact-info-row">
        <span>📧</span>
        <p>fitvora4@gmail.com</p>
      </div>

      <div className="contact-info-row">
        <span>📍</span>
        <p>Faridabad, Haryana</p>
      </div>

        <a
        href="https://wa.me/919217428485"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-premium-btn"
      >
        Chat on WhatsApp
      </a>
    </div>

    {/* RIGHT SIDE */}
    <div className="contact-right">

      <div className="social-premium">
        <a href="#"><FaInstagram /></a>
        <a href="#"><SiZomato /></a>
        <a href="#"><SiSwiggy /></a>
      </div>

      <div className="map-premium">
        <iframe
          src="https://www.google.com/maps?q=Faridabad,Haryana&output=embed"
          loading="lazy"
          title="map"
        ></iframe>
      </div>

    </div>

  </div>
</section>
    
    
      {/* CART */}
      {showCart && (
        <div className="cart-overlay">
          <div className="cart-box">

            <div className="cart-header">
              <h3>Your Cart</h3>
              <button onClick={() => setShowCart(false)}>✖</button>
            </div>

            {cart.length === 0 && <p>Your cart is empty.</p>}

            {cart.map(item => (
              <div className="cart-item" key={item._id}>
                <img src={item.image} alt="" />
                <div className="cart-info">
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                </div>
                <div className="qty">
                  <button onClick={() => updateQty(item._id, "dec")}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, "inc")}>+</button>
                </div>
              </div>
            ))}

            {cart.length > 0 && (
              <>
                <input
                  className="promo-input"
                  placeholder="Promo Code (FIT10)"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                />

                <div className="bill">
                  <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                  <p>GST (5%): ₹{gst.toFixed(2)}</p>
                  <p>Delivery: ₹{delivery}</p>
                  <p>Discount: -₹{discount.toFixed(2)}</p>
                  <h3>Total: ₹{total.toFixed(2)}</h3>
                </div>
              </>
            )}    
            <button
  className="checkout-btn"
  onClick={() => {
    setShowCart(false);
    setShowCheckout(true);
  }}
>
  Proceed to Checkout
</button>


          </div>
        </div>
      )}
      {/* ================= CHECKOUT ================= */}
      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-box">

            <div className="checkout-header">
              <button onClick={() => setShowCheckout(false)}>← Back</button>
              <h3>Delivery Details</h3>
              <button onClick={() => setShowCheckout(false)}>✕</button>
            </div>

            <div className="checkout-form">

              <div className="row">
                <input
                  placeholder="First Name"
                  value={customer.firstName}
                  onChange={(e) =>
                    setCustomer({ ...customer, firstName: e.target.value })
                  }
                />
                <input
                  placeholder="Last Name"
                  value={customer.lastName}
                  onChange={(e) =>
                    setCustomer({ ...customer, lastName: e.target.value })
                  }
                />
              </div>

              <input
                placeholder="Email"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
              />

              <input
                placeholder="Phone"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />

              <h4>Address</h4>

              <input
                placeholder="House No"
                value={customer.house}
                onChange={(e) =>
                  setCustomer({ ...customer, house: e.target.value })
                }
              />

              <input
                placeholder="Street"
                value={customer.street}
                onChange={(e) =>
                  setCustomer({ ...customer, street: e.target.value })
                }
              />

              <input
                placeholder="Landmark"
                value={customer.landmark}
                onChange={(e) =>
                  setCustomer({ ...customer, landmark: e.target.value })
                }
              />

              <div className="row">
                <input
                  placeholder="City"
                  value={customer.city}
                  onChange={(e) =>
                    setCustomer({ ...customer, city: e.target.value })
                  }
                />
                <input
                  placeholder="State"
                  value={customer.state}
                  onChange={(e) =>
                    setCustomer({ ...customer, state: e.target.value })
                  }
                />
              </div>

              <input
                placeholder="Pincode"
                value={customer.pincode}
                onChange={(e) =>
                  setCustomer({ ...customer, pincode: e.target.value })
                }
              />

              <div className="address-type">
                {["Home", "Work", "Other"].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={addressType === type ? "active" : ""}
                    onClick={() => setAddressType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

            </div>

          <button
 className="payment-btn"
 onClick={placeOrder}
 disabled={placingOrder}
>
 {placingOrder ? "Placing Order..." : "Place Order (COD)"}
</button>
          </div>
        </div>
      )}
      
      {/* FLOATING WHATSAPP */}
      <a
        href="https://wa.me/919217428485"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        💬
      </a>
     </div>
        }
      />
     <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
 path="/orders"
 element={
   <ProtectedRoute>
     <OrderHistory />
   </ProtectedRoute>
 }
/>
<Route path="/success" element={<Success />} />
      {/* PROFILE PAGE */}
      
      <Route path="/profile" element={<Profile />} />

    </Routes>


);

  }
