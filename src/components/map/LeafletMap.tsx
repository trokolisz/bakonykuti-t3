'use client'

import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Define the props for the LeafletMap component
interface LeafletMapProps {
  center: [number, number]
  zoom: number
  height?: string
  width?: string
  borderRadius?: string
  popupContent?: React.ReactNode
  className?: string
}

// Create a component that uses the Leaflet library directly without react-leaflet
const LeafletMap = ({
  center,
  zoom,
  height = '400px',
  width = '100%',
  borderRadius = '0.5rem',
  popupContent,
  className = '',
}: LeafletMapProps) => {
  // Create a ref for the map container
  const mapRef = useRef<HTMLDivElement>(null)
  // Create a ref to store the map instance
  const mapInstanceRef = useRef<L.Map | null>(null)
  // State to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false)

  // Set up the map when the component mounts
  useEffect(() => {
    // Set mounted state
    setIsMounted(true)

    // Clean up function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Initialize the map after the component is mounted
  useEffect(() => {
    if (!isMounted || !mapRef.current) return

    // Set up the icon
    const setupIcons = () => {
      try {
        // Use absolute URLs for the icons instead of trying to import them
        const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
        const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
        const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

        // Create a custom icon
        const customIcon = L.icon({
          iconUrl,
          iconRetinaUrl,
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })

        // Set the default icon
        L.Marker.prototype.options.icon = customIcon
      } catch (error) {
        console.error('Error setting up Leaflet icons:', error)
      }
    }

    // Initialize the map
    const initMap = () => {
      // Set up icons first
      setupIcons()

      // Check if map is already initialized
      if (mapInstanceRef.current) {
        // If map exists, just update the view
        mapInstanceRef.current.setView(center, zoom)
        return
      }

      // Create a new map instance
      const map = L.map(mapRef.current!).setView(center, zoom)

      // Add the tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add a marker with popup
      const marker = L.marker(center).addTo(map)

      if (popupContent) {
        // Convert React node to string or HTML element
        let content: string | HTMLElement

        if (typeof popupContent === 'string') {
          content = popupContent
        } else {
          // Create a div to hold the content
          const div = document.createElement('div')
          div.innerHTML = typeof popupContent === 'object' ?
            (popupContent as any).props?.children || 'Bakonykúti' :
            'Bakonykúti'
          content = div
        }

        marker.bindPopup(content).openPopup()
      }

      // Store the map instance
      mapInstanceRef.current = map
    }

    // Initialize the map
    initMap()

    // Clean up function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom, isMounted, popupContent])

  // If not mounted, show a loading indicator
  if (!isMounted) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ height, width, borderRadius }}
      >
        Loading map...
      </div>
    )
  }

  // Return the map container
  return (
    <div
      ref={mapRef}
      className={className}
      style={{ height, width, borderRadius }}
    />
  )
}

export default LeafletMap
