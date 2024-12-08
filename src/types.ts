export type Image = {
  id: number
  title: string
  url: string
  description: string | null
  createdAt: Date
  carousel: boolean
}

export type Page = {
  id: string
  title: string
  content: string | null
  slug: string
  lastModified: Date
}

export type News = {
  id: number
  title: string
  thumbnail: string
  content: string | null
  creatorName: string | null
  createdAt: Date
}

export type Event = {
  id: string
  title: string
  description: string | null
  date: Date
  type: string | null
  createdBy: string | null
  createdAt: Date
}


export type WeatherData = {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}