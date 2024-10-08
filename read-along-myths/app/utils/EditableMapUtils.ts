import { LatLng } from "leaflet";
import { EventLocation } from "./EventLocation";
import { TimelineEventLocation } from "./TimelineEventLocation";

function findMarker(marker: LatLng, eventLocations: TimelineEventLocation[]) {
    return eventLocations.filter((e) => e.lat === marker.lat && e.long === marker.lng)[0];
}

function removeMarker(marker: LatLng) {
    // setDisplayedMarkers(eventLocations.filter((e) => e.lat !== marker.lat && e.long !== marker.lng));
}

function removeAllPathsAssociatedWithMarker(marker: LatLng) {
        
}


export default {
    findMarker,
    removeMarker,
    removeAllPathsAssociatedWithMarker,
}