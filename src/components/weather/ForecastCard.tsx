'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { ForecastData } from '@/types/weather';
import { formatTemperature, formatTime, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { WeatherAPI } from '@/lib/weather-api';

interface ForecastCardProps {
  forecast: ForecastData;
  className?: string;
}

export function ForecastCard({ forecast, className }: ForecastCardProps) {
  // Get next 24 hours (8 items * 3 hours each)
  const hourlyForecast = forecast.list.slice(0, 8);
  
  // Get daily forecast (one item per day)
  const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Hourly Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card glass className="text-white h-full">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <h3 className="text-lg font-semibold">24-Hour Forecast</h3>
              </div>
            </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {hourlyForecast.map((item, index) => (
                <motion.div
                  key={item.dt}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center bg-white/5 rounded-lg p-3 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 min-h-[100px] flex flex-col justify-between"
                >
                  <div className="text-xs text-white/70 font-medium mb-2">
                    {formatTime(item.dt)}
                  </div>
                  <img
                    src={WeatherAPI.getWeatherIconUrl(item.weather[0].icon)}
                    alt={item.weather[0].description}
                    className="w-8 h-8 mx-auto mb-2"
                  />
                  <div className="text-sm font-semibold text-white mb-1">
                    {formatTemperature(item.main.temp)}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">
                    {Math.round(item.pop * 100)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card glass className="text-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <h3 className="text-lg font-semibold">5-Day Forecast</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyForecast.map((item, index) => (
                <motion.div
                  key={item.dt}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-4 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={WeatherAPI.getWeatherIconUrl(item.weather[0].icon)}
                      alt={item.weather[0].description}
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="font-medium">
                        {index === 0 ? 'Today' : formatDate(item.dt).split(',')[0]}
                      </div>
                      <div className="text-sm text-white/60 capitalize">
                        {item.weather[0].description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-white/60">Rain</div>
                      <div className="text-sm">{Math.round(item.pop * 100)}%</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatTemperature(item.main.temp_max)}
                      </div>
                      <div className="text-sm text-white/60">
                        {formatTemperature(item.main.temp_min)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );
} 