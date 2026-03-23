import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import "../index.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function handleSignup() {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>

      <input
        style={{ margin: "10px", padding: "8px", width: "200px" }}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        style={{ margin: "10px", padding: "8px", width: "200px" }}
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button style={{ margin: "8px", padding: "8px 16px" }} onClick={handleLogin}>
        Login
      </button>

      <button style={{ margin: "8px", padding: "8px 16px" }} onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}

export default Login;