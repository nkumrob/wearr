'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import OutfitCard from '@/components/OutfitCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { IWeatherResponse } from '@/types/shared/weather.types'
import { IOutfitRecommendation } from '@/types/shared/outfit.types'

interface WeeklyData {
  weather: IWeatherResponse
  weeklyOutfits: IOutfitRecommendation[]
}

export default function WeekPage() {
  const [data, setData] = useState<WeeklyData | null>(null)
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
          <h2 className="text-3xl font-bold text-gray-900">This Week&apos;s Forecast & Outfits</h2>
          
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