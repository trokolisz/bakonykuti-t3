"use client"


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const BAKONYKUTI_LOCATION = [47.24544, 18.19757] as [number, number]

export function VillageMap() {

  return (
    <>
    <MapContainer
      center={BAKONYKUTI_LOCATION}
      zoom={13}
      style={{ borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={BAKONYKUTI_LOCATION} icon={icon}>
        <Popup>
          <div className="text-center">
            <h3 className="font-semibold">Bakonykúti</h3>
            <p className="text-sm text-muted-foreground">Fejér megye gyöngyszeme</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
    </>
  )
}