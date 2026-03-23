import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { getCoordinates } from "../api";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Location() {
  const { user } = useAuth();
  const [city, setCity] = useState("");

  async function saveLocation() {
    const coords = await getCoordinates(city);
    if (!coords) {
      alert("City not found");
      return;
    }

    const userId = user.uid;

    // Ensure user document exists
    await setDoc(doc(db, "users", userId), { username: userId }, { merge: true });

    // Add location to subcollection
    await addDoc(collection(db, "users", userId, "locations"), {
      city: coords.name,
      latitude: coords.latitude,
      longitude: coords.longitude,
      createdAt: new Date()
    });

    alert("Location saved!");
  }

  return (
    <div style={{ textAlign: "center", margin: "40px" }}>
      <h2>Choose Location</h2>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <br /><br />

      <button onClick={saveLocation}>
        Save Location
      </button>
    </div>
  );
}

export default Location;