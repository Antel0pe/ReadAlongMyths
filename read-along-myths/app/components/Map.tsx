import { LatLngExpression, MapOptions } from "leaflet"
import { MapContainer, Marker, TileLayer, Tooltip, Popup } from "react-leaflet"

export default function Map() {
    const position: LatLngExpression = [51.505, -0.09];
    const zoom: number = 13;

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} className="h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            </MapContainer> 
    )
}