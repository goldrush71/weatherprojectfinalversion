import { Link, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Location from "./pages/Location";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

function App() {
  const { user } = useAuth();

  return (
    <div>
      <nav style={styles.nav}>
        <h2>Weather</h2>

        <p></p>

        {user && (
          <div>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/location" style={styles.link}>Add Location</Link>
            <Link to="/logout" style={styles.link}>Log Out</Link>
          </div>
        )}
      </nav>

      <Routes>
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          [
            <Route key="home" path="/" element={<Home />} />, 
            <Route key="location" path="/location" element={<Location />} />, 
            <Route key="logout" path="/logout" element={<Logout />} />
          ]
        )}
      </Routes>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 25px",
    background: "#0113427",
    color: "white",
    marginLeft:"15%",
    marginRight:"15%"
  },
  link: {
    color: "white",
    marginLeft: "15px",
    textDecoration: "none",
    fontWeight: "bold"
  }
};

export default App;