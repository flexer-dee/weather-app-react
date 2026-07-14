// src/utils/weatherAssets.js

// 1. Translates the current month into a season
export const getSeason = () => {
  const month = new Date().getMonth(); // Returns 0 for Jan, 11 for Dec
  
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

// 2. Translates OpenWeatherMap API codes into our CSS class names
export const getWeatherCondition = (weatherCode) => {
  // 200 range: Thunderstorms
  if (weatherCode >= 200 && weatherCode <= 232) return 'storm';
  
  // 300 & 500 ranges: Drizzle and Rain
  // 600 range: Snow (we are mapping this to rain for now unless you add snow images!)
  if ((weatherCode >= 300 && weatherCode <= 531) || (weatherCode >= 600 && weatherCode <= 622)) return 'rain';
  
  // 700 range: Atmosphere (Fog, Mist, Haze)
  if (weatherCode >= 701 && weatherCode <= 781) return 'fog';
  
  // 800: Exactly clear skies
  if (weatherCode === 800) return 'clear';
  
  // 801+: Cloudy skies
  if (weatherCode >= 801 && weatherCode <= 804) return 'cloudy';
  
  // Default fallback just in case
  return 'clear'; 
};