import { WeatherData, ForecastData, GeocodingData, WeatherSearchResult } from '@/types/weather';

const API_KEY = 'db15c096d0fb4b36a102fb484b94c8dd';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export class WeatherAPI {
  private static async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }
    return response.json();
  }

  static async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return this.fetchData<WeatherData>(url);
  }

  static async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    return this.fetchData<WeatherData>(url);
  }

  static async getForecast(lat: number, lon: number): Promise<ForecastData> {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return this.fetchData<ForecastData>(url);
  }

  static async getForecastByCity(city: string): Promise<ForecastData> {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    return this.fetchData<ForecastData>(url);
  }

  static async searchLocations(query: string): Promise<WeatherSearchResult[]> {
    if (query.length < 2) return [];
    
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const data = await this.fetchData<GeocodingData[]>(url);
    
    return data.map((location, index) => ({
      id: `${location.lat}-${location.lon}-${index}`,
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon,
    }));
  }

  static async getLocationFromCoords(lat: number, lon: number): Promise<string> {
    try {
      const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
      const data = await this.fetchData<GeocodingData[]>(url);
      
      if (data.length > 0) {
        const location = data[0];
        return location.state 
          ? `${location.name}, ${location.state}, ${location.country}`
          : `${location.name}, ${location.country}`;
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Unknown Location';
    }
  }

  static getWeatherIconUrl(iconCode: string, size: '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  }
}

// Demo data for when API key is not available
export const DEMO_WEATHER_DATA: WeatherData = {
  coord: { lon: -74.006, lat: 40.7128 },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }
  ],
  base: 'stations',
  main: {
    temp: 22,
    feels_like: 24,
    temp_min: 18,
    temp_max: 26,
    pressure: 1013,
    humidity: 65
  },
  visibility: 10000,
  wind: {
    speed: 3.5,
    deg: 230
  },
  clouds: {
    all: 0
  },
  dt: Date.now() / 1000,
  sys: {
    type: 1,
    id: 1234,
    country: 'US',
    sunrise: Date.now() / 1000 - 3600 * 6,
    sunset: Date.now() / 1000 + 3600 * 6
  },
  timezone: -14400,
  id: 5128581,
  name: 'New York',
  cod: 200
}; 