
import type { WeatherData } from "~/types"
type Weather = {
    temp: number
    weatherMain: "Clear" | "Clouds" | "Rain" | "Snow" | "Thunderstorm" | "Drizzle" | "Mist" | "Smoke" | "Haze" | "Dust" | "Fog" | "Sand" | "Ash" | "Squall" | "Tornado"
  }

  
export async function fetchWeather() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Bakonykúti&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`,
    {
      next: {
        revalidate: 1800 // Cache for 30 minutes
      }
    }
  )
  const data = await response.json() as WeatherData


  if (!data.main || !data.weather?.[0]) {
    throw new Error("Invalid weather data")
  }

  const temp = data.main.temp
  const weatherMain = data.weather[0].main as Weather["weatherMain"]

  return { temp, weatherMain }
}