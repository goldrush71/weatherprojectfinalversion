function getWindDirection(degree) {
    const directions = [
      'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'
    ];
    const idx = Math.round(((degree % 360) / 22.5));
    return directions[idx];
  }

  import { useState } from "react";

  function WeatherCard({ city, weather }) {
    const [isMetric, setIsMetric] = useState(false);
    if (!weather) return null;

    const windDir = getWindDirection(weather.winddirection);
    // Arrow points up (north) by default, rotate by winddirection degrees
    const arrowStyle = {
      display: 'inline-block',
      transform: `rotate(${weather.winddirection}deg)`,
      transition: 'transform 0.2s',
      margin: '0 6px',
      fontSize: '1.2em',
      verticalAlign: 'middle'
    };

  // Conversion helpers
  const tempC = Math.round(weather.temperature);
  const tempF = Math.round((weather.temperature * 9) / 5 + 32);
  const feelsC = weather.apparent_temperature !== undefined ? Math.round(weather.apparent_temperature) : null;
  const feelsF = weather.apparent_temperature !== undefined ? Math.round(weather.apparent_temperature * 9/5 + 32) : null;
  const dewC = weather.dewpoint !== undefined ? Math.round(weather.dewpoint) : null;
  const dewF = weather.dewpoint !== undefined ? Math.round(weather.dewpoint * 9/5 + 32) : null;
  // Pressure: hPa (metric) or inHg (imperial)
  const pressureMetric = weather.pressure !== undefined ? `${Math.round(weather.pressure)} hPa` : '-';
  const pressureImperial = weather.pressure !== undefined ? `${(weather.pressure * 0.02953).toFixed(2)} inHg` : '-';
  // Precipitation: mm (metric) or in (imperial)
  const precipMetric = weather.precipitation !== undefined ? `${weather.precipitation} mm` : '-';
  const precipImperial = weather.precipitation !== undefined ? `${(weather.precipitation * 0.03937).toFixed(2)} in` : '-';
  // Visibility: km (metric) or mi (imperial)
  const visMetric = weather.visibility !== undefined ? `${(weather.visibility/1000).toFixed(1)} km` : '-';
  const visImperial = weather.visibility !== undefined ? `${(weather.visibility/1609.34).toFixed(1)} mi` : '-';
  // Wind speed: km/h (metric) or mph (imperial)
  const windMetric = weather.windspeed !== undefined ? `${weather.windspeed} km/h` : '-';
  const windImperial = weather.windspeed !== undefined ? `${(weather.windspeed * 0.621371).toFixed(1)} mph` : '-';

  // Format sunrise/sunset
  function formatTime(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Weather code mapping (basic)
  const weatherCodes = {
    0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Dense Drizzle',
    56: 'Freezing Drizzle', 57: 'Freezing Drizzle', 61: 'Slight Rain', 63: 'Rain', 65: 'Heavy Rain',
    66: 'Freezing Rain', 67: 'Freezing Rain', 71: 'Slight Snow', 73: 'Snow', 75: 'Heavy Snow',
    77: 'Snow Grains', 80: 'Slight Showers', 81: 'Showers', 82: 'Violent Showers',
    85: 'Slight Snow Showers', 86: 'Heavy Snow Showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
  };
  const weatherDesc = weatherCodes[weather.weathercode] || 'Unknown';

  return (
    <div style={{...styles.card, position: 'relative'}} className="weather-card">
      <button
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          padding: '2px 6px',
          borderRadius: 5,
          border: 'none',
          background: '#334155',
          color: 'white',
          cursor: 'pointer',
          fontSize: '0.75em',
          outline: 'none',
          transition: 'background 0.2s',
          zIndex: 2,
        }}
        onClick={() => setIsMetric((m) => !m)}
        aria-label="Toggle Metric/Imperial"
      >
        {isMetric ? 'Metric / Imperial' : 'Imperial / Metric'}
      </button>
      <h2 style={styles.city}>{city}</h2>
      <div style={styles.temp}>
        {isMetric ? `${tempC}°C` : `${tempF}°F`}
      </div>
      <div style={styles.details}>
        <div style={{marginBottom: 8, fontWeight: 500}}>{weatherDesc}</div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px'}}>
          <div><strong>Feels Like:</strong> {weather.apparent_temperature !== undefined ? (isMetric ? `${feelsC}°C` : `${feelsF}°F`) : '-'}</div>
          <div><strong>Humidity:</strong> {weather.humidity !== undefined ? `${weather.humidity}%` : '-'}</div>
          <div><strong>Pressure:</strong> {isMetric ? pressureMetric : pressureImperial}</div>
          <div><strong>Clouds:</strong> {weather.cloudcover !== undefined ? `${weather.cloudcover}%` : '-'}</div>
          <div><strong>Precip:</strong> {isMetric ? precipMetric : precipImperial}</div>
          
        </div>
        <div style={{marginTop: 8}}>
          <strong>Sunrise:</strong> {formatTime(weather.sunrise)}
        </div>
        <div style={{marginTop: 8}}>
          <strong>Sunset:</strong> {formatTime(weather.sunset)}
        </div>
        <p style={{marginTop: 8}}>Wind: {isMetric ? windMetric : windImperial} 
          <span style={arrowStyle}>↑</span>
          {windDir} ({weather.winddirection}°)
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#16442d",
    color: "white",
    padding: "25px",
    borderRadius: "12px",
    width: "280px",
    margin: "20px auto",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
  },

  city: {
    marginBottom: "10px",
    fontStyle:'italic'
  },

  temp: {
    fontSize: "40px",
    fontWeight: "bold"
  },

  details: {
    marginTop: "10px",
    opacity: 0.8
  }
};

export default WeatherCard;