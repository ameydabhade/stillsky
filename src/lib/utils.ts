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
    Clear: 'bg-gradient-to-br from-[#181818] via-blue-900/60 to-sky-900/70',
    Clouds: 'bg-gradient-to-br from-[#181818] via-gray-800/80 to-gray-900/70',
    Rain: 'bg-gradient-to-br from-[#181818] via-blue-900/70 to-slate-900/80',
    Drizzle: 'bg-gradient-to-br from-[#181818] via-blue-800/60 to-gray-900/70',
    Thunderstorm: 'bg-gradient-to-br from-[#181818] via-purple-900/80 to-gray-900/90',
    Snow: 'bg-gradient-to-br from-[#181818] via-blue-900/50 to-slate-800/60',
    Mist: 'bg-gradient-to-br from-[#181818] via-gray-800/70 to-slate-900/60',
    Smoke: 'bg-gradient-to-br from-[#181818] via-gray-900/80 to-stone-900/70',
    Haze: 'bg-gradient-to-br from-[#181818] via-orange-900/60 to-yellow-900/50',
    Dust: 'bg-gradient-to-br from-[#181818] via-orange-900/70 to-amber-900/60',
    Fog: 'bg-gradient-to-br from-[#181818] via-gray-800/60 to-slate-900/50',
    Sand: 'bg-gradient-to-br from-[#181818] via-yellow-900/60 to-orange-900/70',
    Ash: 'bg-gradient-to-br from-[#181818] via-gray-900/70 to-stone-900/80',
    Squall: 'bg-gradient-to-br from-[#181818] via-blue-900/80 to-slate-900/70',
    Tornado: 'bg-gradient-to-br from-[#181818] via-red-900/80 to-gray-900/90',
  };
  
  return weatherGradients[weatherMain] || 'bg-gradient-to-br from-[#181818] via-blue-900/60 to-sky-900/70';
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