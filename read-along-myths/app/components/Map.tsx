import { LatLng, LatLngExpression, MapOptions } from "leaflet";
import { Dispatch } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, Popup, Polyline } from "react-leaflet";
import { GraphItem } from "../utils/KnowledgeGraphItem";
import { EventLocation } from "../utils/EventLocation";

type Props = {
    eventLocations: EventLocation[],
}

export default function Map({ eventLocations }: Props) {
    const position: LatLngExpression = [40.0970507, -75.4696358];
    const zoom: number = 5;

    function mapEventLocationsToPositions() {
        let pos = [];

        for (let i = 0; i < eventLocations.length; i++){
            pos.push(new LatLng(eventLocations[i].lat, eventLocations[i].long))
        }

        return pos;
    }

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} className="h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {eventLocations.map((loc, i) => {
                let pos: LatLngExpression = [loc.lat, loc.long];

                return <Marker position={pos}>
                    <Popup>{loc.date}</Popup>
                </Marker>
            })}
            
            <Polyline positions={mapEventLocationsToPositions()} pathOptions={{ color: 'black' }} />

            </MapContainer> 
    )
}