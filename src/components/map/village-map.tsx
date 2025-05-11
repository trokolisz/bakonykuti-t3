"use client"

import dynamic from "next/dynamic"

// Coordinates for Bakonykúti
const BAKONYKUTI_LOCATION: [number, number] = [47.24544, 18.19757]

// Dynamically import the LeafletMap component with no SSR
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false })

export function VillageMap() {
  return (
    <LeafletMap
      center={BAKONYKUTI_LOCATION}
      zoom={13}
      height="400px"
      borderRadius="0.5rem"
      popupContent={
        <div className="text-center">
          <h3 className="font-semibold">Bakonykúti</h3>
          <p className="text-sm">Fejér megye gyöngyszeme</p>
        </div>
      }
    />
  )
}