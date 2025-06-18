import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getWeatherGradient(weatherMain: string): string {
  const weatherGradients: Record<string, string> = {
    Clear: 'gradient-bg-sky',
    Clouds: 'bg-gradient-to-br from-gray-600 to-gray-800',
    Rain: 'bg-gradient-to-br from-gray-700 to-blue-900',
    Drizzle: 'bg-gradient-to-br from-gray-600 to-blue-700',
    Thunderstorm: 'bg-gradient-to-br from-gray-900 to-purple-900',
    Snow: 'bg-gradient-to-br from-gray-200 to-blue-300',
    Mist: 'bg-gradient-to-br from-gray-500 to-gray-700',
    Smoke: 'bg-gradient-to-br from-gray-600 to-gray-800',
    Haze: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    Dust: 'bg-gradient-to-br from-yellow-600 to-orange-700',
    Fog: 'bg-gradient-to-br from-gray-400 to-gray-600',
    Sand: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    Ash: 'bg-gradient-to-br from-gray-500 to-gray-700',
    Squall: 'bg-gradient-to-br from-gray-700 to-blue-900',
    Tornado: 'bg-gradient-to-br from-gray-900 to-red-900',
  };
  
  return weatherGradients[weatherMain] || 'gradient-bg-sky';
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
} 