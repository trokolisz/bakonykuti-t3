
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Cloud, Sun, CloudRain, Snowflake, CloudRainWind, CloudOff, CloudFog, Wind, Cloudy, Droplets, CloudLightning, Tornado } from "lucide-react"

type Weather = {
  temp: number
  weatherMain: "Clear" | "Clouds" | "Rain" | "Snow" | "Thunderstorm" | "Drizzle" | "Mist" | "Smoke" | "Haze" | "Dust" | "Fog" | "Sand" | "Ash" | "Squall" | "Tornado"
}
function WeatherIcon({ weatherMain, className }: { weatherMain: Weather["weatherMain"], className?: string }) {
  const Icon = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Snow: Snowflake,
    Thunderstorm: CloudLightning,
    Drizzle: Droplets,
    Mist: Cloudy,
    Smoke: Wind,
    Haze: CloudFog,
    Dust: CloudFog,
    Fog: CloudFog,
    Sand: Wind,
    Ash: CloudOff,
    Squall: CloudRainWind,
    Tornado: Tornado
  }[weatherMain]

  return <Icon className={className} />
}

export function WeatherWidget({ weather }: { weather: Weather }) {
  if (!weather) return null
  


 

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mai időjárás</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WeatherIcon weatherMain={weather.weatherMain} className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">{weather.temp}°C</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Bakonykúti
        </div>
      </CardContent>
    </Card>
  )
}
