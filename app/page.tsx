'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import WeatherCard from '@/components/WeatherCard'
import OutfitCard from '@/components/OutfitCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import { useGeolocation } from '@/hooks/useGeolocation'
import { IWeatherResponse } from '@/types/shared/weather.types'
import { IOutfit } from '@/types/shared/outfit.types'

interface WeatherData {
  weather: IWeatherResponse
  currentOutfit: IOutfit
  weeklyOutfits?: any[]
}

export default function Home() {
  useServiceWorker()
  const { coords, loading: geoLoading, error: geoError, requestLocation } = useGeolocation()
  
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<string>('London')
  const [usingCoordinates, setUsingCoordinates] = useState(false)

  useEffect(() => {
    if (coords && usingCoordinates) {
      fetchWeatherDataByCoords(coords.latitude, coords.longitude)
    } else if (!usingCoordinates) {
      fetchWeatherData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, coords, usingCoordinates])

  const fetchWeatherData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      
      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherDataByCoords = async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      
      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newLocation = formData.get('location') as string
    if (newLocation) {
      setLocation(newLocation)
      setUsingCoordinates(false)
    }
  }

  const handleUseMyLocation = () => {
    setUsingCoordinates(true)
    requestLocation()
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start pt-12 pb-16">
          <div>
            <h1 className="headline text-6xl md:text-7xl mb-6">
              Dress Smarter,<br />
              <span className="text-primary">Not Harder</span>
            </h1>
            <p className="text-xl text-secondary mb-8 max-w-2xl">
              AI-powered outfit recommendations that adapt to your day&apos;s weather changes
            </p>
          
            {/* Location Controls */}
            <div className="flex flex-wrap gap-3">
              <form onSubmit={handleLocationChange} className="flex gap-3">
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location..."
                  className="px-5 py-3 bg-white border-2 border-warm-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-0 font-medium transition-all duration-200 min-w-[200px]"
                  defaultValue={location}
                  disabled={usingCoordinates}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={usingCoordinates}
                >
                  Update
                </button>
              </form>
              <button
                onClick={handleUseMyLocation}
                className={`btn-secondary flex items-center gap-2 ${geoLoading ? 'opacity-50' : ''}`}
                disabled={geoLoading}
                title="Use my current location"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {geoLoading ? 'Locating...' : 'Use My Location'}
              </button>
            </div>
          </div>
          
          {/* Weather Visual */}
          <div className="relative">
            {data && !loading && (
              <div className="weather-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full -mr-16 -mt-16 opacity-20"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Current Weather</p>
                      <h3 className="text-2xl font-bold text-warm-gray-900">{data.weather.location.name}</h3>
                      <p className="text-tertiary">{new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <img
                      src={`https:${data.weather.current.condition.icon}`}
                      alt={data.weather.current.condition.text}
                      className="w-20 h-20"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-6xl font-bold text-warm-gray-900">{Math.round(data.weather.current.temp_c)}°</p>
                      <p className="text-lg text-secondary mt-1">Feels like {Math.round(data.weather.current.feelslike_c)}°C</p>
                      <p className="text-lg font-medium text-warm-gray-700 mt-2">{data.weather.current.condition.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        )}
        
        {/* Error State */}
        {(error || (geoError && usingCoordinates)) && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium">{error || geoError}</p>
          </div>
        )}
        
        {/* Main Content Grid */}
        {data && !loading && (
          <>
            {/* Today's Outfit Section */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Outfit Recommendation */}
              <div className="outfit-card">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-warm-gray-900">Today&apos;s Outfit</h3>
                      <p className="text-tertiary">AI-curated for {Math.round(data.currentOutfit.temperature)}°C weather</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-secondary mb-8 leading-relaxed">
                    {data.currentOutfit.description}
                  </p>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-warm-gray-900 flex items-center gap-2">
                      <span>Recommended Items</span>
                      <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded-full font-medium">
                        {data.currentOutfit.items.length} pieces
                      </span>
                    </h4>
                    <div className="grid gap-3">
                      {data.currentOutfit.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-warm-gray-50 rounded-lg transition-all hover:bg-warm-gray-100">
                          <div className="text-2xl">{categoryIcons[item.category]}</div>
                          <div className="flex-1">
                            <p className="font-medium text-warm-gray-900">{item.name}</p>
                            <p className="text-sm text-tertiary capitalize">{item.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weather Details */}
              <div className="space-y-6">
                <div className="weather-card">
                  <h4 className="text-lg font-semibold text-warm-gray-900 mb-6">Weather Details</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-tertiary">Humidity</p>
                      <p className="text-2xl font-semibold text-warm-gray-900">{data.weather.current.humidity}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-tertiary">Wind Speed</p>
                      <p className="text-2xl font-semibold text-warm-gray-900">{Math.round(data.weather.current.wind_kph)} km/h</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-tertiary">Precipitation</p>
                      <p className="text-2xl font-semibold text-warm-gray-900">{data.weather.current.precip_mm} mm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-tertiary">UV Index</p>
                      <p className="text-2xl font-semibold text-warm-gray-900">{data.weather.current.uv}</p>
                    </div>
                  </div>
                </div>
                
                {/* Hourly Adjustments */}
                {data.weeklyOutfits && data.weeklyOutfits[0]?.hourlyAdjustments && data.weeklyOutfits[0].hourlyAdjustments.length > 0 && (
                  <div className="weather-card">
                    <h4 className="text-lg font-semibold text-warm-gray-900 mb-6">Hourly Adjustments</h4>
                    <div className="space-y-4">
                      {data.weeklyOutfits[0].hourlyAdjustments.map((adj: any, idx: number) => (
                        <div key={idx} className="p-4 bg-warm-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-primary">{adj.hour}:00</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-warm-gray-900">{adj.adjustment}</p>
                              {adj.items && adj.items.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                  {adj.items.map((item: any) => (
                                    <span key={item.id} className="text-sm bg-white px-3 py-1 rounded-md border border-warm-gray-200">
                                      {item.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

const categoryIcons: Record<string, string> = {
  top: '👔',
  bottom: '👖',
  footwear: '👟',
  outerwear: '🧥',
  accessory: '🧢'
}