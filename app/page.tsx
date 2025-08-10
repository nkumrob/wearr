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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Today&apos;s Weather & Outfit</h2>
          
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
          <div className="grid md:grid-cols-2 gap-6">
            <WeatherCard 
              weather={data.weather.current} 
              location={data.weather.location.name}
            />
            <OutfitCard outfit={data.currentOutfit} />
          </div>
        )}
        
        {data && data.weather.forecast.forecastday.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Hourly Adjustments</h3>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600">
                Check back throughout the day for hourly outfit adjustments based on changing weather conditions.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}