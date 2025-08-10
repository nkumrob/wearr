export interface IWeatherCondition {
  text: string
  icon: string
  code: number
}

export interface ICurrentWeather {
  temp_c: number
  temp_f: number
  feelslike_c: number
  feelslike_f: number
  humidity: number
  wind_kph: number
  wind_mph: number
  precip_mm: number
  precip_in: number
  condition: IWeatherCondition
  uv: number
}

export interface IWeatherLocation {
  name: string
  region: string
  country: string
  lat: number
  lon: number
  localtime: string
}

export interface IForecastDay {
  date: string
  date_epoch: number
  day: {
    maxtemp_c: number
    maxtemp_f: number
    mintemp_c: number
    mintemp_f: number
    avgtemp_c: number
    avgtemp_f: number
    maxwind_kph: number
    maxwind_mph: number
    totalprecip_mm: number
    totalprecip_in: number
    daily_chance_of_rain: number
    condition: IWeatherCondition
    uv: number
  }
  hour: IHourlyWeather[]
}

export interface IHourlyWeather {
  time: string
  time_epoch: number
  temp_c: number
  temp_f: number
  feelslike_c: number
  feelslike_f: number
  condition: IWeatherCondition
  chance_of_rain: number
  wind_kph: number
  wind_mph: number
}

export interface IWeatherResponse {
  location: IWeatherLocation
  current: ICurrentWeather
  forecast: {
    forecastday: IForecastDay[]
  }
}