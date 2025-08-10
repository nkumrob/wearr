'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import WeatherCard from '@/components/WeatherCard'
import OutfitCard from '@/components/OutfitCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import { IWeatherResponse } from '@/types/shared/weather.types'
import { IOutfit } from '@/types/shared/outfit.types'

interface WeatherData {
  weather: IWeatherResponse
  currentOutfit: IOutfit
}

export default function Home() {
  useServiceWorker()
  
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<string>('London')

  useEffect(() => {
    fetchWeatherData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

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

  const handleLocationChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newLocation = formData.get('location') as string
    if (newLocation) {
      setLocation(newLocation)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Today&apos;s Weather & Outfit</h2>
          
          <form onSubmit={handleLocationChange} className="flex gap-2">
            <input
              type="text"
              name="location"
              placeholder="Enter location..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-weather-blue focus:border-transparent"
              defaultValue={location}
            />
            <button
              type="submit"
              className="btn-primary"
            >
              Update
            </button>
          </form>
        </div>
        
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
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