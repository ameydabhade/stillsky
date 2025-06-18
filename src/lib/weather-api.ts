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
    
    try {
      // Try multiple search strategies for better results
      const searchQueries = [
        query, // Original query
        query.replace(/\s+/g, ' ').trim(), // Clean whitespace
        query.split(',')[0].trim(), // Just the first part before comma
      ];
      
      let allResults: GeocodingData[] = [];
      
      // Search with different query variations
      for (const searchQuery of searchQueries) {
        if (searchQuery.length >= 2) {
          const url = `${GEO_URL}/direct?q=${encodeURIComponent(searchQuery)}&limit=10&appid=${API_KEY}`;
          try {
            const data = await this.fetchData<GeocodingData[]>(url);
            allResults = [...allResults, ...data];
          } catch (error) {
            console.warn(`Search failed for "${searchQuery}":`, error);
          }
        }
      }
      
      // Remove duplicates based on coordinates (within 0.01 degree tolerance)
      const uniqueResults = allResults.filter((location, index, array) => {
        return !array.slice(0, index).some(prev => 
          Math.abs(prev.lat - location.lat) < 0.01 && 
          Math.abs(prev.lon - location.lon) < 0.01
        );
      });
      
      // Sort by relevance (exact name matches first, then by name length)
      const sortedResults = uniqueResults.sort((a, b) => {
        const queryLower = query.toLowerCase();
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();
        
        // Exact matches first
        if (aNameLower === queryLower && bNameLower !== queryLower) return -1;
        if (bNameLower === queryLower && aNameLower !== queryLower) return 1;
        
        // Starts with query
        if (aNameLower.startsWith(queryLower) && !bNameLower.startsWith(queryLower)) return -1;
        if (bNameLower.startsWith(queryLower) && !aNameLower.startsWith(queryLower)) return 1;
        
        // Contains query
        if (aNameLower.includes(queryLower) && !bNameLower.includes(queryLower)) return -1;
        if (bNameLower.includes(queryLower) && !aNameLower.includes(queryLower)) return 1;
        
        // Shorter names first (more specific)
        return a.name.length - b.name.length;
      });
      
      // Limit to top 8 results
      return sortedResults.slice(0, 8).map((location, index) => ({
        id: `${location.lat}-${location.lon}-${index}`,
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
      }));
      
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
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