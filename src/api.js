export async function getWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current_weather=true` +
    `&hourly=relative_humidity_2m,apparent_temperature,pressure_msl,cloudcover,precipitation,weathercode,uv_index,visibility,dewpoint_2m` +
    `&daily=sunrise,sunset` +
    `&timezone=auto`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

export async function getCoordinates(city) {

  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
    name: data.results[0].name
  };
}