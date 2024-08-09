import { LatLng, LatLngExpression, MapOptions } from "leaflet";
import { Dispatch, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, Popup, Polyline, useMap } from "react-leaflet";
import { GraphItem } from "../utils/KnowledgeGraphItem";
import { EventLocation } from "../utils/EventLocation";
import MapMarkers from "./MapMarkers";

type Props = {
    eventLocations: EventLocation[],
    zoomToNewestMarker: boolean,
    linePositions: LatLngExpression[] | LatLngExpression[][],
}

export default function Map({ eventLocations, zoomToNewestMarker, linePositions }: Props) {
    const position: LatLngExpression = [0, 0];
    const zoom: number = 2;

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} className="h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapMarkers eventLocations={eventLocations} zoomToNewestMarker={zoomToNewestMarker} linePositions={linePositions} />

        </MapContainer> 
    )
}