import React, { useState, useEffect } from 'react';
import { getWeatherCondition, getSeason } from './utils/weatherAssets';
// NEW: Import Recharts for our data visualization
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const api = {
  key: import.meta.env.VITE_WEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [backgroundMode, setBackgroundMode] = useState('landing'); 
  
  // NEW: States for our Phase 2 features
  const [forecastData, setForecastData] = useState([]);
  const [weatherAlert, setWeatherAlert] = useState(null);

  const [savedCities, setSavedCities] = useState(() => {
    const saved = localStorage.getItem('weatherCities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherCities', JSON.stringify(savedCities));
  }, [savedCities]);

  // UPGRADED: Now fetches both current weather AND the 5-day forecast
  const fetchWeatherByCoords = (lat, lon) => {
    fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setBackgroundMode('weather');
        fetchForecast(lat, lon); // Fetch the trend data
      });
  };

  const fetchWeatherByCity = (cityName) => {
    fetch(`${api.base}weather?q=${cityName}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery('');
        setBackgroundMode('weather');
        fetchForecast(result.coord.lat, result.coord.lon); // Fetch the trend data
      });
  };

  // NEW: Fetches the forecast, formats it for the chart, and checks for storms
  const fetchForecast = (lat, lon) => {
    fetch(`${api.base}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        // 1. Format the next 24 hours (8 time blocks) for Recharts
        const next24Hours = result.list.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
          code: item.weather[0].id
        }));
        setForecastData(next24Hours);

        // 2. Scan for Severe Weather (Any code under 300 is a thunderstorm/extreme event)
        const upcomingStorm = next24Hours.find(item => item.code < 300 || item.code === 781);
        if (upcomingStorm) {
          setWeatherAlert("⚠️ Severe Weather Alert: Storm conditions expected in the next 24 hours.");
        } else {
          setWeatherAlert(null); // Clear previous alerts
        }
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

  const getBackgroundClass = () => {
    if (backgroundMode === 'landing') return 'bg-landing';
    if (backgroundMode === 'season') {
      // Check if we have coordinate data, otherwise default to 0
      const latitude = weather.coord ? weather.coord.lat : 0;
      return `bg-season-${getSeason(latitude)}`;
    }
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

  const formatTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Custom tool tip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="temp">{`${payload[0].value}°c`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <main>
        
        {/* NEW: Severe Weather Alert Banner */}
        {weatherAlert && backgroundMode === 'weather' && (
          <div className="alert-banner">
            {weatherAlert}
          </div>
        )}

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
                  <button onClick={handleSaveCity} className="save-btn" title="Save City">🤍</button>
                </div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              
              <div className="weather-box">
                <div className="temp">{Math.round(weather.main.temp)}°c</div>
                <div className="weather-condition">
                  {backgroundMode === 'season' 
                    ? getSeason(weather.coord ? weather.coord.lat : 0) 
                    : weather.weather[0].main}
                </div>
              </div>

              {/* Conditionally Rendered Extra Details */}
              {backgroundMode === 'weather' ? (
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
              ) : (
                <div className="extra-details">
                  <div className="detail">
                    <span>Feels Like</span>
                    <strong>{Math.round(weather.main.feels_like)}°c</strong>
                  </div>
                  <div className="detail">
                    <span>Humidity</span>
                    <strong>{weather.main.humidity}%</strong>
                  </div>
                  <div className="detail">
                    <span>Wind</span>
                    <strong>{Math.round(weather.wind.speed * 3.6)} km/h</strong>
                  </div>
                </div>
              )}

              {/* NEW: Data Trend Chart */}
              {forecastData.length > 0 && (
                <div className="chart-container">
                  <h3>24-Hour Forecast</h3>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecastData}>
                        <XAxis dataKey="time" stroke="#fff" tick={{fill: '#fff'}} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.4)', strokeWidth: 2 }} />
                        <Line type="monotone" dataKey="temp" stroke="#fff" strokeWidth={4} dot={{ r: 6, fill: '#fff', stroke: '#fff' }} activeDot={{ r: 8, fill: '#2193b0', stroke: '#fff', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

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