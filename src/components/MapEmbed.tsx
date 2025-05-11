'use client'

import React from "react"
import { ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import dynamic from "next/dynamic"

// Dynamically import the LeafletMap component with no SSR
const LeafletMap = dynamic(() => import('./map/LeafletMap'), { ssr: false })

const MapEmbed = () => {
  // Bakonykúti coordinates
  const position: [number, number] = [47.24544, 18.19757]

  const handleOpenOSM = () => {
    const url = `https://www.openstreetmap.org/?mlat=${position[0]}&mlon=${position[1]}&zoom=15`
    window.open(url, '_blank')
  }

  return (
    <div className="rounded-lg overflow-hidden relative">
      <LeafletMap
        center={position}
        zoom={15}
        height="400px"
        popupContent={<>Bakonykúti <br /> Községi Önkormányzat</>}
      />

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
  )
}

export default MapEmbed
