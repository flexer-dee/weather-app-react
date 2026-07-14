import React, { useState } from 'react';
import { getWeatherCondition, getSeason } from './utils/weatherAssets';
import './App.css';

// 1. API Configuration
const api = {
  key: import.meta.env.VITE_WEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [backgroundMode, setBackgroundMode] = useState('landing'); 

  // 2. The Fetch Function
  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          setBackgroundMode('weather'); // Switch to weather view automatically
          console.log(result); // Useful for checking the data in your browser console
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
        });
    }
  };

  // 3. Dynamic Background Logic using Live Data
  const getBackgroundClass = () => {
    if (backgroundMode === 'landing') {
      return 'bg-landing';
    } 
    
    if (backgroundMode === 'season') {
      const currentSeason = getSeason();
      return `bg-season-${currentSeason}`;
    } 
    
    // If we are in weather mode but haven't searched yet, show a default
    if (typeof weather.main === "undefined") {
      return 'bg-weather-clear-day'; 
    }

    // Translate the API data using our utility functions
    const weatherCode = weather.weather[0].id;
    const condition = getWeatherCondition(weatherCode);
    
    // OpenWeatherMap conveniently sends an 'n' or 'd' at the end of their icon codes for night/day
    const isNight = weather.weather[0].icon.includes('n');
    const timeOfDay = isNight ? 'night' : 'day';

    return `bg-weather-${condition}-${timeOfDay}`;
  };

  // 4. Helper function to format the date
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
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
        
        {/* 5. The User Interface */}
        {backgroundMode === 'landing' ? (
          <div className="landing-welcome">
            <h1>Welcome to Weather Forecast</h1>
            <p>Enter a city name above to get started!</p>
          </div>
        ) : (
          (typeof weather.main != "undefined") ? (
            <div className="weather-display">
              
              <div className="location-box">
                <div className="location">{weather.name}, {weather.sys.country}</div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              
              <div className="weather-box">
                <div className="temp">
                  {Math.round(weather.main.temp)}°c
                </div>
                <div className="weather-condition">
                  {/* If in season mode, show the season name. Otherwise, show the weather condition. */}
                  {backgroundMode === 'season' ? getSeason() : weather.weather[0].main}
                </div>
              </div>

              {/* NEW: The extra details row */}
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
                  {/* OpenWeatherMap metric wind is in meters/sec. Multiply by 3.6 to get km/h */}
                  <strong>{Math.round(weather.wind.speed * 3.6)} km/h</strong>
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