import { IClothingItem, IOutfit, IOutfitRecommendation, TWeatherCondition } from '@/types/shared/outfit.types'
import { ICurrentWeather, IForecastDay, IHourlyWeather } from '@/types/shared/weather.types'

const CLOTHING_DATABASE: IClothingItem[] = [
  // Tops
  { id: 't1', name: 'Tank Top', category: 'top', minTemp: 25, weatherConditions: ['hot', 'warm'] },
  { id: 't2', name: 'T-Shirt', category: 'top', minTemp: 18, maxTemp: 30, weatherConditions: ['warm', 'mild'] },
  { id: 't3', name: 'Long Sleeve Shirt', category: 'top', minTemp: 10, maxTemp: 22, weatherConditions: ['mild', 'cool'] },
  { id: 't4', name: 'Sweater', category: 'top', minTemp: 0, maxTemp: 15, weatherConditions: ['cool', 'cold'] },
  { id: 't5', name: 'Heavy Sweater', category: 'top', maxTemp: 10, weatherConditions: ['cold', 'snowy'] },
  
  // Bottoms
  { id: 'b1', name: 'Shorts', category: 'bottom', minTemp: 20, weatherConditions: ['hot', 'warm'] },
  { id: 'b2', name: 'Light Pants', category: 'bottom', minTemp: 15, maxTemp: 25, weatherConditions: ['warm', 'mild'] },
  { id: 'b3', name: 'Jeans', category: 'bottom', minTemp: 5, maxTemp: 22, weatherConditions: ['mild', 'cool', 'cold'] },
  { id: 'b4', name: 'Warm Pants', category: 'bottom', maxTemp: 10, weatherConditions: ['cold', 'snowy'] },
  
  // Footwear
  { id: 'f1', name: 'Sandals', category: 'footwear', minTemp: 22, weatherConditions: ['hot', 'warm'] },
  { id: 'f2', name: 'Sneakers', category: 'footwear', minTemp: 5, weatherConditions: ['warm', 'mild', 'cool'] },
  { id: 'f3', name: 'Boots', category: 'footwear', maxTemp: 15, weatherConditions: ['cool', 'cold', 'rainy', 'snowy'] },
  { id: 'f4', name: 'Rain Boots', category: 'footwear', weatherConditions: ['rainy'] },
  
  // Outerwear
  { id: 'o1', name: 'Light Jacket', category: 'outerwear', minTemp: 10, maxTemp: 18, weatherConditions: ['mild', 'cool'] },
  { id: 'o2', name: 'Rain Jacket', category: 'outerwear', weatherConditions: ['rainy'] },
  { id: 'o3', name: 'Winter Coat', category: 'outerwear', maxTemp: 5, weatherConditions: ['cold', 'snowy'] },
  { id: 'o4', name: 'Windbreaker', category: 'outerwear', minTemp: 8, maxTemp: 20, weatherConditions: ['mild', 'cool'] },
  
  // Accessories
  { id: 'a1', name: 'Sunglasses', category: 'accessory', minTemp: 15, weatherConditions: ['hot', 'warm'] },
  { id: 'a2', name: 'Hat', category: 'accessory', weatherConditions: ['hot', 'warm', 'cold', 'snowy'] },
  { id: 'a3', name: 'Scarf', category: 'accessory', maxTemp: 10, weatherConditions: ['cold', 'snowy'] },
  { id: 'a4', name: 'Gloves', category: 'accessory', maxTemp: 5, weatherConditions: ['cold', 'snowy'] },
  { id: 'a5', name: 'Umbrella', category: 'accessory', weatherConditions: ['rainy'] },
]

export class OutfitRecommender {
  private determineWeatherCondition(temp: number, condition: string): TWeatherCondition {
    const lowerCondition = condition.toLowerCase()
    
    if (lowerCondition.includes('rain')) return 'rainy'
    if (lowerCondition.includes('snow')) return 'snowy'
    
    if (temp >= 30) return 'hot'
    if (temp >= 20) return 'warm'
    if (temp >= 15) return 'mild'
    if (temp >= 5) return 'cool'
    return 'cold'
  }

  private filterClothingByWeather(
    temp: number,
    weatherCondition: TWeatherCondition
  ): IClothingItem[] {
    return CLOTHING_DATABASE.filter(item => {
      const tempMatch = 
        (item.minTemp === undefined || temp >= item.minTemp) &&
        (item.maxTemp === undefined || temp <= item.maxTemp)
      
      const conditionMatch = item.weatherConditions.includes(weatherCondition)
      
      return tempMatch && conditionMatch
    })
  }

  private buildOutfit(availableClothing: IClothingItem[]): IClothingItem[] {
    const outfit: IClothingItem[] = []
    const categories = ['top', 'bottom', 'footwear', 'outerwear', 'accessory']
    
    categories.forEach(category => {
      const items = availableClothing.filter(item => item.category === category)
      if (items.length > 0) {
        // For accessories and outerwear, they might be optional
        if (category === 'outerwear' || category === 'accessory') {
          // Add based on specific conditions
          items.forEach(item => {
            if (shouldIncludeItem(item)) {
              outfit.push(item)
            }
          })
        } else {
          // For essential items (top, bottom, footwear), pick the first suitable one
          outfit.push(items[0])
        }
      }
    })
    
    return outfit
    
    function shouldIncludeItem(item: IClothingItem): boolean {
      // Always include rain gear if it's rainy
      if (item.weatherConditions.includes('rainy') && availableClothing.some(i => i.weatherConditions.includes('rainy'))) {
        return true
      }
      // Include winter accessories if it's cold
      if (['a3', 'a4'].includes(item.id) && availableClothing.some(i => i.weatherConditions.includes('cold'))) {
        return true
      }
      // Include sunglasses if it's sunny and warm
      if (item.id === 'a1') {
        return true
      }
      // Include outerwear if available
      if (item.category === 'outerwear') {
        return true
      }
      return false
    }
  }

  recommendOutfitForWeather(weather: ICurrentWeather, date: string = new Date().toISOString()): IOutfit {
    const temp = weather.temp_c
    const feelsLike = weather.feelslike_c
    const condition = weather.condition.text
    const weatherCondition = this.determineWeatherCondition(feelsLike, condition)
    
    const availableClothing = this.filterClothingByWeather(feelsLike, weatherCondition)
    const outfitItems = this.buildOutfit(availableClothing)
    
    return {
      id: `outfit-${Date.now()}`,
      date,
      temperature: temp,
      feelsLike,
      condition,
      items: outfitItems,
      description: this.generateOutfitDescription(outfitItems, weatherCondition, temp)
    }
  }

  recommendOutfitForDay(forecastDay: IForecastDay): IOutfitRecommendation {
    const avgTemp = forecastDay.day.avgtemp_c
    
    const mockCurrentWeather: ICurrentWeather = {
      temp_c: avgTemp,
      temp_f: forecastDay.day.avgtemp_f,
      feelslike_c: avgTemp,
      feelslike_f: forecastDay.day.avgtemp_f,
      humidity: 50,
      wind_kph: forecastDay.day.maxwind_kph,
      wind_mph: forecastDay.day.maxwind_mph,
      precip_mm: forecastDay.day.totalprecip_mm,
      precip_in: forecastDay.day.totalprecip_in,
      condition: forecastDay.day.condition,
      uv: forecastDay.day.uv
    }
    
    const primaryOutfit = this.recommendOutfitForWeather(mockCurrentWeather, forecastDay.date)
    
    // Generate hourly adjustments if we have hourly data
    const hourlyAdjustments = this.generateHourlyAdjustments(forecastDay.hour)
    
    return {
      primary: primaryOutfit,
      hourlyAdjustments
    }
  }

  private generateHourlyAdjustments(hourlyWeather: IHourlyWeather[]) {
    const adjustments: {
      hour: number
      adjustment: string
      items?: IClothingItem[]
    }[] = []
    
    // Check morning (8 AM), afternoon (2 PM), and evening (6 PM)
    const checkHours = [8, 14, 18]
    
    checkHours.forEach(hour => {
      const hourData = hourlyWeather.find(h => new Date(h.time).getHours() === hour)
      if (hourData) {
        const adjustment = this.getAdjustmentForHour(hourData, hour)
        if (adjustment) {
          adjustments.push({
            hour,
            adjustment: adjustment.adjustment,
            items: adjustment.items
          })
        }
      }
    })
    
    return adjustments
  }

  private getAdjustmentForHour(hourData: IHourlyWeather, hour: number): {
    adjustment: string
    items?: IClothingItem[]
  } | null {
    const temp = hourData.feelslike_c
    const rainChance = hourData.chance_of_rain
    
    if (hour === 8 && temp < 10) {
      const scarf = CLOTHING_DATABASE.find(i => i.id === 'a3')
      return {
        adjustment: 'Morning will be chilly, consider adding a scarf',
        items: scarf ? [scarf] : []
      }
    }
    
    if (hour === 18 && temp < 15) {
      const jacket = CLOTHING_DATABASE.find(i => i.id === 'o1')
      return {
        adjustment: 'Evening will be cooler, bring a jacket',
        items: jacket ? [jacket] : []
      }
    }
    
    if (rainChance > 50) {
      const umbrella = CLOTHING_DATABASE.find(i => i.id === 'a5')
      return {
        adjustment: `${hour === 8 ? 'Morning' : hour === 14 ? 'Afternoon' : 'Evening'} rain expected, bring an umbrella`,
        items: umbrella ? [umbrella] : []
      }
    }
    
    return null
  }

  private generateOutfitDescription(items: IClothingItem[], condition: TWeatherCondition, temp: number): string {
    const itemNames = items.map(i => i.name.toLowerCase()).join(', ')
    
    const conditionDescriptions: Record<TWeatherCondition, string> = {
      hot: `Perfect for a hot day at ${temp}°C`,
      warm: `Great for warm weather around ${temp}°C`,
      mild: `Comfortable outfit for mild ${temp}°C weather`,
      cool: `Stay cozy in the cool ${temp}°C weather`,
      cold: `Bundle up for the cold ${temp}°C temperature`,
      rainy: `Stay dry in the rain with ${temp}°C`,
      snowy: `Winter-ready for snowy ${temp}°C weather`
    }
    
    return `${conditionDescriptions[condition]}. Today's outfit: ${itemNames}.`
  }
}