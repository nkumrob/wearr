'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import OutfitCard from '@/components/OutfitCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useGeolocation } from '@/hooks/useGeolocation'
import { IWeatherResponse } from '@/types/shared/weather.types'
import { IOutfitRecommendation } from '@/types/shared/outfit.types'

interface WeeklyData {
  weather: IWeatherResponse
  weeklyOutfits: IOutfitRecommendation[]
}

export default function WeekPage() {
  const { coords, loading: geoLoading, error: geoError, requestLocation } = useGeolocation()
  
  const [data, setData] = useState<WeeklyData | null>(null)
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
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}&days=7`)
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
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}&days=7`)
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
      <div className="space-y-6">
        <div className="mb-12">
          <h1 className="headline text-5xl md:text-6xl mb-4">
            This Week&apos;s<br />
            <span className="text-primary">Weather Wardrobe</span>
          </h1>
          <p className="text-xl text-secondary max-w-2xl">
            Plan your outfits for the next 7 days with AI-powered recommendations
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          
          <div className="flex gap-2">
            <form onSubmit={handleLocationChange} className="flex gap-2">
              <input
                type="text"
                name="location"
                placeholder="Enter location..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-weather-blue focus:border-transparent"
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
        
        {loading && <LoadingSpinner />}
        
        {(error || (geoError && usingCoordinates)) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || geoError}
          </div>
        )}
        
        {data && !loading && (
          <>
            <div className="weather-card mb-8">
              <h3 className="text-xl font-semibold text-warm-gray-900 mb-6">
                7-Day Overview for {data.weather.location.name}
              </h3>
              <div className="grid grid-cols-7 gap-3">
                {data.weather.forecast.forecastday.map((day, index) => (
                  <div key={index} className="text-center p-3 rounded-lg hover:bg-warm-gray-50 transition-colors">
                    <p className="text-sm font-medium text-tertiary mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <img
                      src={`https:${day.day.condition.icon}`}
                      alt={day.day.condition.text}
                      className="w-12 h-12 mx-auto mb-2"
                    />
                    <p className="text-xl font-bold text-warm-gray-900">
                      {Math.round(day.day.maxtemp_c)}°
                    </p>
                    <p className="text-sm text-tertiary">
                      {Math.round(day.day.mintemp_c)}°
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.weeklyOutfits.map((outfitRec, index) => {
                const day = data.weather.forecast.forecastday[index]
                return (
                  <div key={index} className="outfit-card group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <p className="text-lg font-bold text-warm-gray-900">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-warm-gray-900">{Math.round(day.day.avgtemp_c)}°</p>
                          <p className="text-sm text-tertiary">{day.day.condition.text}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm text-secondary leading-relaxed">
                          {outfitRec.primary.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-warm-gray-100">
                          {outfitRec.primary.items.slice(0, 4).map((item: any) => (
                            <span key={item.id} className="text-lg" title={item.name}>
                              {categoryIcons[item.category]}
                            </span>
                          ))}
                          {outfitRec.primary.items.length > 4 && (
                            <span className="text-sm text-tertiary">+{outfitRec.primary.items.length - 4}</span>
                          )}
                        </div>
                        
                        {outfitRec.hourlyAdjustments && outfitRec.hourlyAdjustments.length > 0 && (
                          <div className="pt-3 border-t border-warm-gray-100">
                            <p className="text-xs font-medium text-tertiary uppercase tracking-wider mb-2">
                              Daily Tips
                            </p>
                            {outfitRec.hourlyAdjustments.slice(0, 1).map((adj: any, idx: number) => (
                              <p key={idx} className="text-sm text-secondary">
                                {adj.hour}:00 - {adj.adjustment}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
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