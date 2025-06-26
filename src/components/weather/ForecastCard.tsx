'use client';

import React, { useEffect, useRef } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { ForecastData } from '@/types/weather';
import { formatTemperature, formatTime, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { WeatherAPI } from '@/lib/weather-api';
import { floatingAnimation, buttonPressAnimation } from '@/lib/gsap-animations';
import { gsap } from 'gsap';

interface ForecastCardProps {
  forecast: ForecastData;
  className?: string;
}

export function ForecastCard({ forecast, className }: ForecastCardProps) {
  const hourlyRef = useRef<HTMLDivElement>(null);
  const dailyRef = useRef<HTMLDivElement>(null);
  const hourlyItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dailyItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Get next 24 hours (8 items * 3 hours each)
  const hourlyForecast = forecast.list.slice(0, 8);
  
  // Get daily forecast (one item per day)
  const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);

  useEffect(() => {
    // Animate forecast cards entrance
    const tl = gsap.timeline();
    
    // Set initial states
    gsap.set(hourlyRef.current, { y: 30, opacity: 0 });
    gsap.set(dailyRef.current, { y: 30, opacity: 0 });
    gsap.set('.forecast-hourly-item', { y: 20, opacity: 0, scale: 0.9 });
    gsap.set('.forecast-daily-item', { x: -20, opacity: 0 });
    
    // Animate main cards
    tl.to(hourlyRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    })
    .to(dailyRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    
    // Animate hourly items with stagger
    .to('.forecast-hourly-item', {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.4')
    
    // Animate daily items with stagger
    .to('.forecast-daily-item', {
      x: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.6');

    // Add floating animation to weather icons
    const icons = document.querySelectorAll('.forecast-icon');
    icons.forEach((icon, index) => {
      setTimeout(() => {
        floatingAnimation(icon as HTMLElement);
      }, index * 200);
    });

    return () => {
      tl.kill();
    };
  }, [forecast]);

  const handleHourlyItemClick = (index: number) => {
    if (hourlyItemsRef.current[index]) {
      buttonPressAnimation(hourlyItemsRef.current[index]!);
    }
  };

  const handleDailyItemClick = (index: number) => {
    if (dailyItemsRef.current[index]) {
      buttonPressAnimation(dailyItemsRef.current[index]!);
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Hourly Forecast */}
        <div ref={hourlyRef}>
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
                                     <div
                     key={item.dt}
                     ref={(el) => { hourlyItemsRef.current[index] = el; }}
                     onClick={() => handleHourlyItemClick(index)}
                    className="forecast-hourly-item text-center bg-white/5 rounded-lg p-3 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 min-h-[100px] flex flex-col justify-between cursor-pointer group hover:scale-105 transition-transform"
                  >
                    <div className="text-xs text-white/70 font-medium mb-2 group-hover:text-white transition-colors">
                      {formatTime(item.dt)}
                    </div>
                    <img
                      src={WeatherAPI.getWeatherIconUrl(item.weather[0].icon)}
                      alt={item.weather[0].description}
                      className="forecast-icon w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform"
                    />
                    <div className="text-sm font-semibold text-white mb-1 group-hover:text-blue-200 transition-colors">
                      {formatTemperature(item.main.temp)}
                    </div>
                    <div className="text-xs text-blue-300 font-medium group-hover:text-blue-200 transition-colors">
                      {Math.round(item.pop * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Forecast */}
        <div ref={dailyRef}>
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
                                     <div
                     key={item.dt}
                     ref={(el) => { dailyItemsRef.current[index] = el; }}
                     onClick={() => handleDailyItemClick(index)}
                    className="forecast-daily-item flex items-center justify-between bg-white/5 rounded-lg p-4 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 cursor-pointer group hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={WeatherAPI.getWeatherIconUrl(item.weather[0].icon)}
                        alt={item.weather[0].description}
                        className="forecast-icon w-10 h-10 group-hover:scale-110 transition-transform"
                      />
                      <div>
                        <div className="font-medium group-hover:text-blue-200 transition-colors">
                          {index === 0 ? 'Today' : formatDate(item.dt).split(',')[0]}
                        </div>
                        <div className="text-sm text-white/60 capitalize group-hover:text-white/80 transition-colors">
                          {item.weather[0].description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">Rain</div>
                        <div className="text-sm group-hover:text-blue-200 transition-colors">{Math.round(item.pop * 100)}%</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold group-hover:text-orange-200 transition-colors">
                          {formatTemperature(item.main.temp_max)}
                        </div>
                        <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                          {formatTemperature(item.main.temp_min)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 