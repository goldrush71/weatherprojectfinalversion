import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getWeather } from "../api";
import WeatherCard from "../components/WeatherCard";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import "../index.css";

function Home() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [locations, setLocations] = useState([]);
  const { user } = useAuth();

  async function loadSavedLocations() {
    const snapshot = await getDocs(
      collection(db, "users", user.uid, "locations")
    );

    const loadedLocations = snapshot.docs.map(doc => ({ 
      id: doc.id,
      ...doc.data()
    }));

    setLocations(loadedLocations);
  }

  async function loadWeatherForCity(location) {
    const data = await getWeather(location.latitude, location.longitude);
    setCity(location.city);

    // Find the index in hourly data that matches the current time
    const now = data.current_weather.time;
    const hIdx = data.hourly.time.findIndex(t => t === now);

    // Get daily sunrise/sunset for today
    let sunrise = null, sunset = null;
    if (data.daily && data.daily.sunrise && data.daily.sunset) {
      // Find the daily index for today
      const today = now.split('T')[0];
      const dIdx = data.daily.time.findIndex(t => t === today);
      if (dIdx !== -1) {
        sunrise = data.daily.sunrise[dIdx];
        sunset = data.daily.sunset[dIdx];
      }
    }

    // Compose weather object for WeatherCard
    setWeather({
      ...data.current_weather,
      humidity: hIdx !== -1 ? data.hourly.relative_humidity_2m[hIdx] : undefined,
      apparent_temperature: hIdx !== -1 ? data.hourly.apparent_temperature[hIdx] : undefined,
      pressure: hIdx !== -1 ? data.hourly.pressure_msl[hIdx] : undefined,
      cloudcover: hIdx !== -1 ? data.hourly.cloudcover[hIdx] : undefined,
      precipitation: hIdx !== -1 ? data.hourly.precipitation[hIdx] : undefined,
      uv_index: hIdx !== -1 ? data.hourly.uv_index[hIdx] : undefined,
      visibility: hIdx !== -1 ? data.hourly.visibility[hIdx] : undefined,
      dewpoint: hIdx !== -1 ? data.hourly.dewpoint_2m[hIdx] : undefined,
      sunrise,
      sunset
    });
  }

  async function deleteLocation(id) {
    await deleteDoc(doc(db, "users", user.uid, "locations", id));
    loadSavedLocations();
  }

  useEffect(() => {
    loadSavedLocations();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      {weather && <WeatherCard city={city} weather={weather} />}
      <div className="saved-cities">
        <h2><i>Locations</i></h2>
        {locations.length === 0 && <p>No saved locations yet.</p>}
        {locations.map(location => (
          <div
            key={location.id}
            style={{
              background: "#113427",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
              marginLeft:"35%",
              marginRight:"35%",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{location.city}</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => loadWeatherForCity(location)}>
                View
              </button>

              <button onClick={() => deleteLocation(location.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;