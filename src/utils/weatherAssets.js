// src/utils/weatherAssets.js

// 1. Translates the current month into a season
// src/utils/weatherAssets.js

export const getSeason = (lat = 0) => {
  const month = new Date().getMonth(); // Returns 0 for Jan, 11 for Dec
  const isNorthernHemisphere = lat >= 0;

  if (isNorthernHemisphere) {
    // Northern Hemisphere Seasons
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  } else {
    // Southern Hemisphere Seasons (Inverted)
    if (month >= 2 && month <= 4) return 'autumn';
    if (month >= 5 && month <= 7) return 'winter';
    if (month >= 8 && month <= 10) return 'spring';
    return 'summer';
  }
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