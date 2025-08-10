export type TClothingCategory = 'top' | 'bottom' | 'footwear' | 'outerwear' | 'accessory'
export type TWeatherCondition = 'hot' | 'warm' | 'mild' | 'cool' | 'cold' | 'rainy' | 'snowy'

export interface IClothingItem {
  id: string
  name: string
  category: TClothingCategory
  minTemp?: number
  maxTemp?: number
  weatherConditions: TWeatherCondition[]
  icon?: string
}

export interface IOutfit {
  id: string
  date: string
  temperature: number
  feelsLike: number
  condition: string
  items: IClothingItem[]
  description?: string
  imageUrl?: string
}

export interface IOutfitRecommendation {
  primary: IOutfit
  alternatives?: IOutfit[]
  hourlyAdjustments?: {
    hour: number
    adjustment: string
    items?: IClothingItem[]
  }[]
}