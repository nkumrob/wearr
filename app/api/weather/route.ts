import { NextRequest, NextResponse } from 'next/server'
import { WeatherAPIClient } from '@/lib/server/weather-api'
import { OutfitRecommender } from '@/lib/server/outfit-recommender'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const location = searchParams.get('location') || 'London'
    const days = parseInt(searchParams.get('days') || '7')
    
    const weatherClient = new WeatherAPIClient()
    const outfitRecommender = new OutfitRecommender()
    
    // Use coordinates if provided, otherwise use location name
    const queryLocation = lat && lon ? `${lat},${lon}` : location
    const weatherData = await weatherClient.getForecast(queryLocation, days)
    
    // Generate outfit recommendation for current weather
    const currentOutfit = outfitRecommender.recommendOutfitForWeather(weatherData.current)
    
    // Generate outfit recommendations for each forecast day
    const weeklyOutfits = weatherData.forecast.forecastday.map(day => 
      outfitRecommender.recommendOutfitForDay(day)
    )
    
    return NextResponse.json({
      weather: weatherData,
      currentOutfit,
      weeklyOutfits
    })
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}