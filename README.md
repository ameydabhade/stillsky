# 🌤️ StillSky - Beautiful Weather Experience

A stunning, modern weather application built with Next.js, featuring beautiful animations, glassmorphism design, and real-time weather data.

## ✨ Features

- **Beautiful UI/UX**: Glassmorphism design with smooth animations
- **Real-time Weather**: Current weather conditions and forecasts
- **Location Search**: Search for any city worldwide
- **Geolocation Support**: Automatic location detection
- **Responsive Design**: Works perfectly on all devices
- **Dynamic Backgrounds**: Weather-based gradient backgrounds
- **Smooth Animations**: Framer Motion powered transitions
- **5-Day Forecast**: Extended weather predictions
- **Weather Details**: Humidity, pressure, wind speed, visibility
- **Sunrise/Sunset Times**: Solar information display

## 🎨 Design Highlights

- Glassmorphism effects with backdrop blur
- Dynamic gradient backgrounds based on weather conditions
- Smooth animations and transitions
- Modern card-based layout
- Responsive grid system
- Beautiful weather icons
- Interactive search with autocomplete

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (optional - app works with demo data)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stillsky
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key_here
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add it to your `.env.local` file

**Note**: The app works with demo data if no API key is provided.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript
- **Weather API**: OpenWeatherMap
- **Font**: Inter

## 📱 Features in Detail

### Current Weather Display
- Large temperature display with weather icon
- Location and date information
- "Feels like" temperature
- Weather description
- High/low temperatures

### Weather Details Grid
- Humidity percentage
- Wind speed and direction
- Atmospheric pressure
- Visibility range

### Solar Information
- Sunrise time
- Sunset time
- Beautifully displayed with icons

### 24-Hour Forecast
- Hourly weather predictions
- Temperature and precipitation chance
- Weather icons for each hour
- Responsive grid layout

### 5-Day Forecast
- Daily weather overview
- High/low temperatures
- Precipitation probability
- Weather condition descriptions

### Search Functionality
- Real-time city search
- Autocomplete suggestions
- Country and state information
- Smooth animations

## 🎯 Performance Features

- **Optimized Images**: Next.js Image optimization
- **Fast Loading**: Efficient API calls and caching
- **Responsive**: Mobile-first design approach
- **Accessible**: Keyboard navigation and screen reader support
- **SEO Friendly**: Proper meta tags and structure

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Mobile Experience

The app is fully responsive and provides an excellent mobile experience with:
- Touch-friendly interface
- Optimized layouts for mobile screens
- Fast loading on mobile networks
- Smooth touch animations

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # UI components
│   └── weather/        # Weather-specific components
├── lib/                # Utility functions
├── types/              # TypeScript types
└── ...
```

## 🎨 Customization

The app is highly customizable. You can:

- Modify gradient backgrounds in `src/lib/utils.ts`
- Update animations in component files
- Change the color scheme in `src/app/globals.css`
- Add new weather data displays

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data API
- Lucide React for beautiful icons
- Framer Motion for smooth animations
- Tailwind CSS for styling system

---

**Built with ❤️ by the StillSky Team**
# stillsky
