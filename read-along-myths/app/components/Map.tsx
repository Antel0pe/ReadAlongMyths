import { LatLng, LatLngExpression, MapOptions } from "leaflet";
import { Dispatch, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, Popup, Polyline, useMap } from "react-leaflet";
import { GraphItem } from "../utils/KnowledgeGraphItem";
import { EventLocation } from "../utils/EventLocation";
import MapMarkers from "./MapMarkers";

type Props = {
    eventLocations: EventLocation[],
}

export default function Map({ eventLocations }: Props) {
    const position: LatLngExpression = [40.0970507, -75.4696358];
    const zoom: number = 5;

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} className="h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapMarkers eventLocations={eventLocations} />

        </MapContainer> 
    )
}