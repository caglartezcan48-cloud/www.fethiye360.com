export async function getWeatherData() {
  const lat = 36.6210;
  const lon = 29.1164;
  
  try {
    // 1. Hava Durumu Verisi
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
      { next: { revalidate: 3600 } } // 1 saat önbellek
    );
    const weatherData = await weatherRes.json();

    // 2. Deniz Suyu Sıcaklığı
    const marineRes = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=sea_surface_temperature`,
      { next: { revalidate: 3600 } }
    );
    const marineData = await marineRes.json();

    return {
      current: {
        temp: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        conditionCode: weatherData.current.weather_code,
        seaTemp: marineData.current?.sea_surface_temperature || 20, // Fallback
      },
      daily: weatherData.daily.time.map((date: string, i: number) => ({
        date,
        maxTemp: Math.round(weatherData.daily.temperature_2m_max[i]),
        minTemp: Math.round(weatherData.daily.temperature_2m_min[i]),
        conditionCode: weatherData.daily.weather_code[i],
      }))
    };
  } catch (error) {
    console.error('Weather data fetch error:', error);
    return null;
  }
}

// Weather code to text/icon mapping helper
export function getWeatherStatus(code: number) {
  if (code === 0) return 'Güneşli';
  if (code >= 1 && code <= 3) return 'Parçalı Bulutlu';
  if (code >= 45 && code <= 48) return 'Sisli';
  if (code >= 51 && code <= 67) return 'Yağmurlu';
  if (code >= 71 && code <= 77) return 'Karlı';
  if (code >= 80 && code <= 82) return 'Sağanak Yağış';
  if (code >= 95) return 'Fırtınalı';
  return 'Açık';
}
