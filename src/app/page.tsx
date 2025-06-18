'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  Loader2, 
  AlertCircle, 
  MapPin, 
  RefreshCw,
  Github,
  Heart
} from 'lucide-react';
import { WeatherData, ForecastData, WeatherSearchResult } from '@/types/weather';
import { WeatherAPI, DEMO_WEATHER_DATA } from '@/lib/weather-api';
import { getWeatherGradient, getTimeOfDay } from '@/lib/utils';
import { SearchBox } from '@/components/ui/SearchBox';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { ForecastCard } from '@/components/weather/ForecastCard';

export default function HomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const timeOfDay = getTimeOfDay();

  const getBackgroundGradient = () => {
    if (weather) {
      return getWeatherGradient(weather.weather[0].main);
    }
    
    // Default gradients based on time of day with #181818 base
    const timeGradients = {
      morning: 'bg-gradient-to-br from-[#181818] via-blue-900/80 to-purple-900/60',
      afternoon: 'bg-gradient-to-br from-[#181818] via-blue-800/70 to-cyan-900/60',
      evening: 'bg-gradient-to-br from-[#181818] via-orange-900/70 to-pink-900/60',
      night: 'bg-gradient-to-br from-[#181818] via-gray-900/80 to-indigo-900/70',
    };
    
    return timeGradients[timeOfDay];
  };

  const fetchWeatherData = async (lat?: number, lon?: number, cityName?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let weatherData: WeatherData;
      let forecastData: ForecastData;
      
      if (lat !== undefined && lon !== undefined) {
        [weatherData, forecastData] = await Promise.all([
          WeatherAPI.getCurrentWeather(lat, lon),
          WeatherAPI.getForecast(lat, lon)
        ]);

      } else if (cityName) {
        [weatherData, forecastData] = await Promise.all([
          WeatherAPI.getCurrentWeatherByCity(cityName),
          WeatherAPI.getForecastByCity(cityName)
        ]);

      } else {
        throw new Error('No location provided');
      }
      
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Unable to fetch weather data. Using demo data.');
      // Use demo data as fallback
      setWeather(DEMO_WEATHER_DATA);

    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Location access denied. Using demo data.');
          setWeather(DEMO_WEATHER_DATA);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported. Using demo data.');
      setWeather(DEMO_WEATHER_DATA);
      setLoading(false);
    }
  }, []);

  const handleLocationSelect = (location: WeatherSearchResult) => {
    fetchWeatherData(location.lat, location.lon);
  };

  const handleRefresh = async () => {
    if (weather) {
      setIsRefreshing(true);
      await fetchWeatherData(weather.coord.lat, weather.coord.lon);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className={`min-h-screen ${getBackgroundGradient()} transition-all duration-1000`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <Navigation className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">StillSky</h1>
                <p className="text-white/60 text-sm">Beautiful Weather Experience</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <SearchBox onLocationSelect={handleLocationSelect} />
              
              {weather && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors backdrop-blur-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={getCurrentLocation}
                className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <MapPin className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                  <p className="text-white/80 text-lg">Getting weather data...</p>
                </div>
              </motion.div>
            ) : error && !weather ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-white text-lg mb-4">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={getCurrentLocation}
                    className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                  >
                    Try Again
                  </motion.button>
                </div>
              </motion.div>
            ) : weather ? (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Main Weather Card */}
                <div>
                  <WeatherCard weather={weather} />
                </div>

                {/* Forecast Card */}
                <div>
                  {forecast && <ForecastCard forecast={forecast} />}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>Amey Dabhade</span>
              <span>•</span>
              <a 
                href="https://github.com/ameydabhade/stillsky" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>

          </motion.div>
        </div>
      </footer>
    </div>
  );
}
