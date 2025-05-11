'use client'

import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = () => {
  useEffect(() => {
    // Only run this on the client side
    (async () => {
      // Dynamically load the marker icon images
      const { default: marker } = await import("leaflet/dist/images/marker-icon.png")
      const { default: marker2x } = await import("leaflet/dist/images/marker-icon-2x.png")
      const { default: markerShadow } = await import("leaflet/dist/images/marker-shadow.png")

      // Delete the default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl

      // Set up the default icon
      L.Icon.Default.mergeOptions({
        iconUrl: marker.src,
        iconRetinaUrl: marker2x.src,
        shadowUrl: markerShadow.src,
      })
    })()
  }, [])

  return null
}

const MapEmbed = () => {
  const [isMounted, setIsMounted] = useState(false)

  // Bakonykúti coordinates
  const position: [number, number] = [47.24544, 18.19757]

  const handleOpenOSM = () => {
    const url = `https://www.openstreetmap.org/?mlat=${position[0]}&mlon=${position[1]}&zoom=15`
    window.open(url, '_blank')
  }

  // Only render the map on the client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[400px] bg-gray-100 flex items-center justify-center">Loading map...</div>
  }

  return (
    <>
      <DefaultIcon />
      <div className="rounded-lg overflow-hidden relative h-[400px]">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              Bakonykúti <br /> Községi Önkormányzat
            </Popup>
          </Marker>
        </MapContainer>

        <div className="absolute bottom-4 right-4 z-[1000]">
          <Button
            variant="default"
            size="sm"
            onClick={handleOpenOSM}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Nagyobb térkép</span>
          </Button>
        </div>
      </div>
    </>
  )
}

export default MapEmbed
