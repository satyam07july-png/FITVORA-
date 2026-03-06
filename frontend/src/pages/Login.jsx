import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      login(res.data.token);
      navigate("/");

    } catch (err) {
      alert("Invalid credentials");
    }
  };
  localStorage.setItem("token", data.token);

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
