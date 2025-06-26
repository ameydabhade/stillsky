'use client';

import React, { useEffect, useRef } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  MapPin,
  Calendar
} from 'lucide-react';
import { WeatherData } from '@/types/weather';
import { formatTemperature, capitalizeWords, formatTime, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { WeatherAPI } from '@/lib/weather-api';
import { 
  floatingAnimation, 
  weatherCardHover, 
  animateCounter, 
  staggerWeatherDetails 
} from '@/lib/gsap-animations';

interface WeatherCardProps {
  weather: WeatherData;
  className?: string;
}

export function WeatherCard({ weather, className }: WeatherCardProps) {
  const iconUrl = WeatherAPI.getWeatherIconUrl(weather.weather[0].icon, '4x');
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const tempRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Start floating animation for weather icon
    if (iconRef.current) {
      floatingAnimation(iconRef.current);
    }
    
    // Animate temperature counter
    if (tempRef.current) {
      const temp = Math.round(weather.main.temp);
      animateCounter(tempRef.current, 0, temp, 1.5);
    }
    
    // Stagger weather details animation
    setTimeout(() => {
      staggerWeatherDetails();
    }, 600);
  }, [weather]);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      weatherCardHover.enter(cardRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      weatherCardHover.leave(cardRef.current);
    }
  };
  
  return (
    <div className={className}>
      <div 
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        {/* Glow effect for hover */}
        <div className="card-glow absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-xl opacity-0" />
        
        <Card glass className="p-8 text-white relative z-10 weather-detail">
          <CardContent className="p-0">
            {/* Header with location and date */}
            <div className="flex items-center justify-between mb-6 weather-detail">
              <div>
                <div className="flex items-center space-x-2 text-white/80 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{weather.name}, {weather.sys.country}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(weather.dt)}</span>
                </div>
              </div>
            </div>

            {/* Main weather display */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <div className="text-6xl font-bold mb-2 weather-detail">
                  <span ref={tempRef}>{formatTemperature(weather.main.temp)}</span>
                </div>
                <div className="text-white/80 text-lg mb-1 weather-detail">
                  {capitalizeWords(weather.weather[0].description)}
                </div>
                <div className="text-white/60 text-sm weather-detail">
                  Feels like {formatTemperature(weather.main.feels_like)}
                </div>
              </div>
              
              <div className="flex-shrink-0 weather-detail">
                <img 
                  ref={iconRef}
                  src={iconUrl} 
                  alt={weather.weather[0].description}
                  className="w-32 h-32 drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Weather details grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm weather-detail-item hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-2 text-white/60 mb-1">
                  <Thermometer className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                  <span className="text-xs">High/Low</span>
                </div>
                <div className="text-white font-semibold">
                  {formatTemperature(weather.main.temp_max)} / {formatTemperature(weather.main.temp_min)}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm weather-detail-item hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-2 text-white/60 mb-1">
                  <Droplets className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  <span className="text-xs">Humidity</span>
                </div>
                <div className="text-white font-semibold">{weather.main.humidity}%</div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm weather-detail-item hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-2 text-white/60 mb-1">
                  <Wind className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-xs">Wind</span>
                </div>
                <div className="text-white font-semibold">{weather.wind.speed} m/s</div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm weather-detail-item hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-2 text-white/60 mb-1">
                  <Gauge className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
                  <span className="text-xs">Pressure</span>
                </div>
                <div className="text-white font-semibold">{weather.main.pressure} hPa</div>
              </div>
            </div>

            {/* Sun times with enhanced styling */}
            <div className="flex justify-between mt-6 pt-6 border-t border-white/10 weather-detail">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors group-hover:scale-110 transition-transform">
                  <Sunrise className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-white/60 text-xs">Sunrise</div>
                  <div className="text-white font-medium">{formatTime(weather.sys.sunrise)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors group-hover:scale-110 transition-transform">
                  <Sunset className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-white/60 text-xs">Sunset</div>
                  <div className="text-white font-medium">{formatTime(weather.sys.sunset)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors group-hover:scale-110 transition-transform">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white/60 text-xs">Visibility</div>
                  <div className="text-white font-medium">{(weather.visibility / 1000).toFixed(1)} km</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 