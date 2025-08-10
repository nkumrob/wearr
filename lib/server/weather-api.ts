import { IWeatherResponse } from '@/types/shared/weather.types'

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || ''
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1'

export class WeatherAPIClient {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || WEATHER_API_KEY
    if (!this.apiKey) {
      throw new Error('Weather API key is required')
    }
  }

  async getCurrentWeather(location: string): Promise<IWeatherResponse> {
    const url = `${WEATHER_API_BASE_URL}/current.json?key=${this.apiKey}&q=${encodeURIComponent(location)}&aqi=no`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`)
    }
    
    return response.json()
  }

  async getForecast(location: string, days: number = 7): Promise<IWeatherResponse> {
    const url = `${WEATHER_API_BASE_URL}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(location)}&days=${days}&aqi=no&alerts=no`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`)
    }
    
    return response.json()
  }

  async searchLocation(query: string): Promise<Array<{
    id: number
    name: string
    region: string
    country: string
    lat: number
    lon: number
    url: string
  }>> {
    const url = `${WEATHER_API_BASE_URL}/search.json?key=${this.apiKey}&q=${encodeURIComponent(query)}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`)
    }
    
    return response.json()
  }
}