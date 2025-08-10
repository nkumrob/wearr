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
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">This Week&apos;s Forecast & Outfits</h2>
          
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                7-Day Weather Overview for {data.weather.location.name}
              </h3>
              <div className="grid grid-cols-7 gap-2 text-center">
                {data.weather.forecast.forecastday.map((day, index) => (
                  <div key={index} className="p-2">
                    <p className="text-sm font-medium text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.round(day.day.maxtemp_c)}°
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.round(day.day.mintemp_c)}°
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.weeklyOutfits.map((outfitRec, index) => (
                <OutfitCard 
                  key={index} 
                  outfit={outfitRec.primary} 
                  variant="compact"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}