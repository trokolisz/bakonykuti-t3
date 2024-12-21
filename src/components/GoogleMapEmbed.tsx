'use client'

import React from "react"
import { GoogleMap, LoadScript } from "@react-google-maps/api"
import { ExternalLink } from "lucide-react"
import { Button } from "./ui/button"

const containerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 47.24544,
  lng: 18.19757,
}

const GoogleMapEmbed = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`
    window.open(url, '_blank')
  }

  if (!apiKey) {
    return <div>Google Maps API Key is not configured.</div>
  }

  return (
    <>
    <div className="rounded-lg overflow-hidden relative">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{
            streetViewControl: true,
            mapTypeControl: true,
          }}
        />
      </LoadScript>
      
    </div>
    <div className="absolute bottom-4 right-4">   
  </div>
  </>
  )
}

export default GoogleMapEmbed
