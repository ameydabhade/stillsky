'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { 
  pageLoadAnimation, 
  createParticleSystem, 
  refreshAnimation,
  buttonPressAnimation,
  weatherTransition,
  initScrollAnimations,
  magneticEffect,
  textRevealAnimation,
  parallaxScroll
} from '@/lib/gsap-animations';

export default function HomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const backgroundRef = useRef<HTMLDivElement>(null);
  const refreshButtonRef = useRef<HTMLButtonElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const hasAnimated = useRef(false);

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
      
      // Create particle system based on weather
      if (backgroundRef.current) {
        // Clear existing particles
        const existingParticles = backgroundRef.current.querySelectorAll('.floating-particle');
        existingParticles.forEach(particle => particle.remove());
        
        // Create new particles
        createParticleSystem(backgroundRef.current, weatherData.weather[0].main);
      }
      
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
    weatherTransition(location.name);
    setTimeout(() => {
      fetchWeatherData(location.lat, location.lon);
    }, 400);
  };

  const handleRefresh = async () => {
    if (weather && refreshButtonRef.current) {
      setIsRefreshing(true);
      refreshAnimation(refreshButtonRef.current);
      await fetchWeatherData(weather.coord.lat, weather.coord.lon);
      setIsRefreshing(false);
    }
  };

  const handleLocationClick = () => {
    if (locationButtonRef.current) {
      buttonPressAnimation(locationButtonRef.current);
    }
    getCurrentLocation();
  };

  // Initialize GSAP animations
  useEffect(() => {
    if (!loading && !hasAnimated.current) {
      setTimeout(() => {
        pageLoadAnimation();
        initScrollAnimations();
        parallaxScroll();
        
        // Add magnetic effect to interactive buttons
        const interactiveElements = document.querySelectorAll('.magnetic-element');
        interactiveElements.forEach((element) => {
          magneticEffect(element as HTMLElement);
        });
        
        // Add text reveal to title
        const titleElement = document.querySelector('.title-reveal');
        if (titleElement) {
          textRevealAnimation(titleElement as HTMLElement, 0.5);
        }
        
        hasAnimated.current = true;
      }, 100);
    }
  }, [loading]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div ref={backgroundRef} className={`min-h-screen ${getBackgroundGradient()} transition-all duration-1000 relative overflow-hidden`}>
      {/* Enhanced Background Layers */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      
      {/* Animated background elements for parallax */}
      <div className="parallax-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
      <div className="parallax-element absolute top-60 right-20 w-24 h-24 bg-blue-400/10 rounded-full blur-lg" />
      <div className="parallax-element absolute bottom-40 left-1/4 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl" />
      
      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 header-element">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white title-reveal">StillSky</h1>
                <p className="text-white/60 text-sm">Beautiful Weather Experience</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 header-element">
              <SearchBox onLocationSelect={handleLocationSelect} />
              
              {weather && (
                <button
                  ref={refreshButtonRef}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="magnetic-element p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors backdrop-blur-sm disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              )}
              
              <button
                ref={locationButtonRef}
                onClick={handleLocationClick}
                className="magnetic-element p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors backdrop-blur-sm hover:scale-105 transition-transform"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>
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
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-white mx-auto mb-4 loading-spinner" />
                    <div className="absolute inset-0 w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto" />
                  </div>
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
                  <button
                    onClick={getCurrentLocation}
                    className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm hover:scale-105 transition-transform"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            ) : weather ? (
              <div className="space-y-8 weather-content">
                {/* Main Weather Card */}
                <div className="weather-card">
                  <WeatherCard weather={weather} />
                </div>

                {/* Forecast Card */}
                <div className="forecast-card">
                  {forecast && <ForecastCard forecast={forecast} />}
                </div>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 p-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center header-element">
            <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Amey Dabhade</span>
              <span>•</span>
              <a 
                href="https://github.com/ameydabhade/stillsky" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-white transition-colors hover:scale-105 transition-transform"
                onClick={(e) => buttonPressAnimation(e.currentTarget as HTMLElement)}
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
