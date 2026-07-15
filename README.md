# 🌤️ Dynamic React Weather Dashboard

A beautifully designed, fully responsive React weather application that provides real-time meteorological data, interactive forecasts, and a dynamic user interface that adapts to local conditions.

## ✨ Features

* **Real-Time Data:** Fetches live weather conditions, including temperature, humidity, wind speed, visibility, and exact sunrise/sunset times.
* **Dynamic Backgrounds:** The app's background seamlessly transitions based on the current weather condition (clear, rain, storm, etc.), the time of day (day/night), or the user's local season.
* **Hemisphere-Aware Seasons:** Season logic calculates the exact season (Summer, Winter, Spring, Autumn) based on the target city's geographical latitude and the current month.
* **Auto-Geolocation:** Automatically detects the user's coordinates on boot to deliver instant local weather data.
* **Saved Cities (LocalStorage):** Users can save their favorite cities, creating quick-access buttons that persist even after the browser is closed.
* **Interactive 24-Hour Forecast:** Utilizes `Recharts` to plot an elegant, interactive trendline of the temperature over the next 24 hours.
* **Severe Weather Alerts:** Automatically scans upcoming forecast data and triggers a pulsing warning banner if extreme conditions (like thunderstorms) are detected.
* **Glassmorphism UI:** Features a modern, frosted-glass design aesthetic that is 100% mobile-responsive.

## 🛠️ Tech Stack

* **Frontend Framework:** React (bootstrapped with Vite)
* **Styling:** Vanilla CSS (Glassmorphism, Flexbox, CSS Animations, Media Queries)
* **Data Visualization:** Recharts
* **API:** OpenWeatherMap (Current Weather Data & 5-Day/3-Hour Forecast API)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You will need Node.js and Yarn installed on your machine. You will also need a free API key from [OpenWeatherMap](https://openweathermap.org/api).

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YourUsername/weather-app-react.git](https://github.com/YourUsername/weather-app-react.git)
   cd weather-app-react
   ### Installation

1. **Install dependencies:**
   ```bash
   yarn install

2. **Set up your environment variables**
   Create a new file in the root directory named .env and add your OpenWeatherMap API key:
   VITE_WEATHER_API_KEY=your_actual_api_key_here

3. **Start the developmemnt server**
   '''bash
   yarn dev

4. **Open the app:**
   Navigate to `http://localhost:5173` in your web browser.

## 📂 Project Structure

* `/src/assets` - Contains all high-resolution background imagery for various weather states and seasons.
* `/src/utils/weatherAssets.js` - Contains the core logic for translating OpenWeatherMap API codes into UI states and calculating hemisphere-aware seasons.
* `App.jsx` - The main application component handling state, API fetch logic, and UI rendering.
* `App.css` - All styling, animations, and media queries for mobile responsiveness.

## 💡 What I Learned

Building this project reinforced several core React and general web development concepts:
* Managing complex, asynchronous state using `useState` and `useEffect`.
* Safely hiding API keys in a Vite environment using `.env` files.
* Parsing and formatting deeply nested JSON payloads from third-party APIs.
* Implementing data persistence using the browser's native `localStorage`.
* Integrating external charting libraries (`Recharts`) to visualize complex data arrays.