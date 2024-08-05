import { LatLng, LatLngExpression, MapOptions } from "leaflet";
import { Dispatch, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, Popup, Polyline, useMap } from "react-leaflet";
import { EventLocation } from "../utils/EventLocation"

type Props = {
    eventLocations: EventLocation[],
}

export default function MapMarkers({ eventLocations }: Props) {
    const map = useMap();

    // zoom to newest marker every time new marker is added
    useEffect(() => {
        if (eventLocations.length === 0) return;

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
    
    return (
        <>
            {eventLocations.map((loc, i) => {
                let pos: LatLngExpression = [loc.lat, loc.long];

                return <Marker key={i} position={pos}>
                    <Popup>{loc.date}</Popup>
                </Marker>
            })}
            
            <Polyline positions={mapEventLocationsToPositions()} pathOptions={{ color: 'black' }} />
        </>
    )
}
