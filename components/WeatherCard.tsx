import Image from 'next/image'
import { ICurrentWeather } from '@/types/shared/weather.types'

interface WeatherCardProps {
  weather: ICurrentWeather
  location?: string
}

export default function WeatherCard({ weather, location }: WeatherCardProps) {
  return (
    <div className="weather-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {location || 'Current Location'}
          </h2>
          <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        <Image
          src={`https:${weather.condition.icon}`}
          alt={weather.condition.text}
          width={64}
          height={64}
          className="w-16 h-16"
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-5xl font-bold text-gray-900">{Math.round(weather.temp_c)}°C</p>
          <p className="text-lg text-gray-600">Feels like {Math.round(weather.feelslike_c)}°C</p>
          <p className="text-lg font-medium text-gray-700 mt-1">{weather.condition.text}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="text-lg font-medium text-gray-900">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Wind</p>
            <p className="text-lg font-medium text-gray-900">{Math.round(weather.wind_kph)} km/h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Precipitation</p>
            <p className="text-lg font-medium text-gray-900">{weather.precip_mm} mm</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">UV Index</p>
            <p className="text-lg font-medium text-gray-900">{weather.uv}</p>
          </div>
        </div>
      </div>
    </div>
  )
}