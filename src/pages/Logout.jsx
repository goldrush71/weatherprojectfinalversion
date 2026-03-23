import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";

export default function Logout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function doLogout() {
      try {
        await signOut(auth);
        navigate("/login");
      } catch (err) {
        setError("Failed to log out");
      }
    }
    doLogout();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Logging out...</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
