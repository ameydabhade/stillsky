'use client';

import React from 'react';
import { motion } from 'framer-motion';
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

interface WeatherCardProps {
  weather: WeatherData;
  className?: string;
}

export function WeatherCard({ weather, className }: WeatherCardProps) {
  const iconUrl = WeatherAPI.getWeatherIconUrl(weather.weather[0].icon, '4x');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card glass className="p-8 text-white">
        <CardContent className="p-0">
          {/* Header with location and date */}
          <div className="flex items-center justify-between mb-6">
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl font-bold mb-2"
              >
                {formatTemperature(weather.main.temp)}
              </motion.div>
              <div className="text-white/80 text-lg mb-1">
                {capitalizeWords(weather.weather[0].description)}
              </div>
              <div className="text-white/60 text-sm">
                Feels like {formatTemperature(weather.main.feels_like)}
              </div>
            </div>
            
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex-shrink-0"
            >
              <img 
                src={iconUrl} 
                alt={weather.weather[0].description}
                className="w-32 h-32 float-animation"
              />
            </motion.div>
          </div>

          {/* Weather details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2 text-white/60 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs">High/Low</span>
              </div>
              <div className="text-white font-semibold">
                {formatTemperature(weather.main.temp_max)} / {formatTemperature(weather.main.temp_min)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2 text-white/60 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-xs">Humidity</span>
              </div>
              <div className="text-white font-semibold">{weather.main.humidity}%</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/5 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2 text-white/60 mb-1">
                <Wind className="w-4 h-4" />
                <span className="text-xs">Wind</span>
              </div>
              <div className="text-white font-semibold">{weather.wind.speed} m/s</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/5 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2 text-white/60 mb-1">
                <Gauge className="w-4 h-4" />
                <span className="text-xs">Pressure</span>
              </div>
              <div className="text-white font-semibold">{weather.main.pressure} hPa</div>
            </motion.div>
          </div>

          {/* Sun times */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex justify-between mt-6 pt-6 border-t border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Sunrise className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-white/60 text-xs">Sunrise</div>
                <div className="text-white font-medium">{formatTime(weather.sys.sunrise)}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Sunset className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-white/60 text-xs">Sunset</div>
                <div className="text-white font-medium">{formatTime(weather.sys.sunset)}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-white/60 text-xs">Visibility</div>
                <div className="text-white font-medium">{(weather.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 