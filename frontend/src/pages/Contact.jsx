import { useState } from "react";


export default function Contact() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();

    if (data.success) {
      alert("Message Sent Successfully ✅");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      alert("Something went wrong ❌");
    }
  };
};