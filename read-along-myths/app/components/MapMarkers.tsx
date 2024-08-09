import { LatLng, LatLngExpression, MapOptions } from "leaflet";
import { Dispatch, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, Popup, Polyline, useMap } from "react-leaflet";
import { EventLocation } from "../utils/EventLocation"

type Props = {
    eventLocations: EventLocation[],
    zoomToNewestMarker: boolean,
    linePositions: number[][] | number[][][],
}

export default function MapMarkers({ eventLocations, zoomToNewestMarker, linePositions }: Props) {
    const map = useMap();

    // zoom to newest marker every time new marker is added
    useEffect(() => {
        if (eventLocations.length === 0) return;
        if (!zoomToNewestMarker) return;

        let lastEventLocation = eventLocations[eventLocations.length - 1];
        map.flyTo(new LatLng(lastEventLocation.lat, lastEventLocation.long));

    }, [eventLocations])

    function mapEventLocationsToPositions() {
        let pos = [];

        for (let i = 0; i < eventLocations.length; i++){
            pos.push(new LatLng(eventLocations[i].lat, eventLocations[i].long))
        }

        return pos;
    }

    function convertPositionsToLatLng() {
        if (linePositions.length === 0) return [];

        // does each item in the array, contain an array of nums
        // have to check that each item is not an object because for whatever reason they are strings and not numbers???
        if (linePositions.every((p) => p.every((i) => typeof(i) !== 'object'))) {
            return linePositions.map((p) => {
                return new LatLng(p[0], p[1])
            })
        } else {
            return linePositions.map((p) => {
                return [
                    new LatLng(p[0][0], p[0][1]),
                    new LatLng(p[1][0], p[1][1])
                ]
            })
        }
    }
    
    return (
        <>
            {eventLocations.map((loc, i) => {
                let pos: LatLngExpression = [loc.lat, loc.long];

                return <Marker key={i} position={pos}>
                    <Popup>{loc.text}</Popup>
                </Marker>
            })}

            <Polyline positions={convertPositionsToLatLng()} pathOptions={{ color: 'black' }} />
        </>
    )
}
