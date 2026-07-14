import React, { useState, useEffect } from 'react';
import { getWeatherCondition, getSeason } from './utils/weatherAssets';
import './App.css';

const api = {
  key: import.meta.env.VITE_WEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [backgroundMode, setBackgroundMode] = useState('landing'); 
  
  // NEW: State for Saved Cities
  const [savedCities, setSavedCities] = useState(() => {
    // Load saved cities from localStorage on boot
    const saved = localStorage.getItem('weatherCities');
    return saved ? JSON.parse(saved) : [];
  });

  // NEW: Auto-Geolocation on Load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      });
    }
  }, []); // Empty array means this only runs once when the app opens

  // NEW: Save cities to localStorage whenever the array changes
  useEffect(() => {
    localStorage.setItem('weatherCities', JSON.stringify(savedCities));
  }, [savedCities]);

  const fetchWeatherByCoords = (lat, lon) => {
    fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setBackgroundMode('weather');
      });
  };

  const fetchWeatherByCity = (cityName) => {
    fetch(`${api.base}weather?q=${cityName}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery('');
        setBackgroundMode('weather');
      });
  };

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetchWeatherByCity(query);
    }
  };

  const handleSaveCity = () => {
    if (weather.name && !savedCities.includes(weather.name)) {
      setSavedCities([...savedCities, weather.name]);
    }
  };

  const handleRemoveCity = (cityToRemove) => {
    setSavedCities(savedCities.filter(city => city !== cityToRemove));
  };

  // --- Helpers ---
  const getBackgroundClass = () => {
    if (backgroundMode === 'landing') return 'bg-landing';
    if (backgroundMode === 'season') return `bg-season-${getSeason()}`;
    if (typeof weather.main === "undefined") return 'bg-weather-clear-day'; 
    
    const condition = getWeatherCondition(weather.weather[0].id);
    const timeOfDay = weather.weather[0].icon.includes('n') ? 'night' : 'day';
    return `bg-weather-${condition}-${timeOfDay}`;
  };

  const dateBuilder = (d) => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // NEW: Convert Unix timestamp to readable time (e.g., 6:30 AM)
  const formatTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <main>
        
        <div className="toggle-container">
          <button className="toggle-btn" onClick={() => setBackgroundMode('weather')}>Weather</button>
          <button className="toggle-btn" onClick={() => setBackgroundMode('season')}>Season</button>
          <button className="toggle-btn" onClick={() => setBackgroundMode('landing')}>Home</button>
        </div>

        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search city and press Enter..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>

        {/* NEW: Saved Cities Quick-Links */}
        {savedCities.length > 0 && (
          <div className="saved-cities-container">
            {savedCities.map((city, index) => (
              <div key={index} className="saved-city-pill">
                <span onClick={() => fetchWeatherByCity(city)}>{city}</span>
                <button className="delete-btn" onClick={() => handleRemoveCity(city)}>×</button>
              </div>
            ))}
          </div>
        )}
        
        {backgroundMode === 'landing' ? (
          <div className="landing-welcome">
            <h1>Welcome to Weather Forecast</h1>
            <p>Enter a city name or allow location access to begin.</p>
          </div>
        ) : (
          (typeof weather.main != "undefined") ? (
            <div className="weather-display">
              
              <div className="location-box">
                <div className="location">
                  {weather.name}, {weather.sys.country} 
                  {/* Heart button to save city */}
                  <button onClick={handleSaveCity} className="save-btn" title="Save City">🤍</button>
                </div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              
              <div className="weather-box">
                <div className="temp">{Math.round(weather.main.temp)}°c</div>
                <div className="weather-condition">
                  {backgroundMode === 'season' ? getSeason() : weather.weather[0].main}
                </div>
              </div>

              {/* UPGRADED: Extra Details Panel */}
              <div className="extra-details">
                <div className="detail">
                  <span>Visibility</span>
                  <strong>{(weather.visibility / 1000).toFixed(1)} km</strong>
                </div>
                <div className="detail">
                  <span>Sunrise</span>
                  <strong>{formatTime(weather.sys.sunrise)}</strong>
                </div>
                <div className="detail">
                  <span>Sunset</span>
                  <strong>{formatTime(weather.sys.sunset)}</strong>
                </div>
              </div>

            </div>
          ) : (
            <div className="landing-welcome">
              <p>Search for a city to see the weather!</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default App;