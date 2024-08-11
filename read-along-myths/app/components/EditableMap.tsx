import { useMap, useMapEvents } from "react-leaflet/hooks"
import { EventLocation } from "../utils/EventLocation";
import { Dispatch, useState } from "react";
import { LatLng } from "leaflet";

type Props = {
    eventLocations: EventLocation[],
    linePositions: number[][][],
    setDisplayedMarkers: Dispatch<EventLocation[]>,
    setLinePositions: Dispatch<number[][][]>,
}

export default function EditableMap({ eventLocations, linePositions, setDisplayedMarkers, setLinePositions }: Props) {
    const [prevClickedMarker, setPrevClickedMarker] = useState<LatLng | null>(null);

    const map = useMap();
    const mapEvents = useMapEvents({
        click: (e) => {
            console.log('clicked map!');
            console.log(e);

            setDisplayedMarkers([...eventLocations, {
                lat: e.latlng.lat,
                long: e.latlng.lng,
                text: 'test'
            }]);
        }, popupopen: (e) => {
            console.log('pop up opened!');
            console.log(e.popup);

            let popupLatLng = e.popup.getLatLng();
            if (!popupLatLng) return;

            if (prevClickedMarker === null) {
                setPrevClickedMarker(popupLatLng);
            } else {
                setLinePositions([...linePositions, [
                    [prevClickedMarker.lat, prevClickedMarker.lng],
                    [popupLatLng.lat, popupLatLng.lng]
                ]]);

                setPrevClickedMarker(null);
            }
        },

    });

    function removeMarker(marker: LatLng) {
        setDisplayedMarkers(eventLocations.filter((e) => e.lat !== marker.lat && e.long !== marker.lng));
    }

    function removeAllPathsAssociatedWithMarker(marker: LatLng) {
        
    }

    return <></>;
}