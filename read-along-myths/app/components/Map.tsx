import { LatLng, LatLngExpression, MapOptions } from "leaflet";
import { Dispatch, ReactNode, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, Popup, Polyline, useMap } from "react-leaflet";
import { GraphItem } from "../utils/KnowledgeGraphItem";
import { EventLocation } from "../utils/EventLocation";
import MapMarkers from "./MapMarkers";
import EditableMap from "./EditableMap";
import { Slider } from "@mui/material";

type Props = {
    eventLocations: EventLocation[],
    zoomToNewestMarker: boolean,
    linePositions: number[][] | number[][][],
    children?: ReactNode,
    clickedChatItem: EventLocation | undefined,
}

export default function Map({ eventLocations, zoomToNewestMarker, linePositions, clickedChatItem, children }: Props) {
    const position: LatLngExpression = [0, 0];
    const zoom: number = 2;

    const [displayedLocations, setDisplayedLocations] = useState<EventLocation[]>(eventLocations);
    const [displayedLines, setDisplayedLines] = useState<number[][] | number[][][]>(linePositions);
    const [sliderValue, setSliderValue] = useState<number>(0);

    useEffect(() => {
        setSliderValue(eventLocations.length - 1);
        
        setDisplayedLocations(eventLocations);
        setDisplayedLines(linePositions);
    }, [eventLocations, linePositions]);


    return (
        <>
            <div className="h-full flex flex-col">
                <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} className="flex-grow">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapMarkers eventLocations={displayedLocations} zoomToNewestMarker={zoomToNewestMarker} linePositions={displayedLines} clickedChatItem={clickedChatItem} />

                    { children }

                </MapContainer> 

                <div className="h-16 bg-white p-4 rounded-lg shadow-md">
                    <Slider
                        aria-label="Time slider"
                        defaultValue={0}
                        step={1}
                        marks={eventLocations.map((_, index) => ({
                            value: index,
                            label: eventLocations[index]?.text,
                        }))}
                        min={0}
                        max={eventLocations.length - 1}
                        value={sliderValue}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => eventLocations[value]?.text || ''}
                        onChange={(_, value) => {
                            const currentValue = Array.isArray(value) ? value[0] : value;

                            setDisplayedLocations(eventLocations.slice(0, currentValue + 1));
                            setDisplayedLines(linePositions.slice(0, currentValue + 1));
                            
                            setSliderValue(currentValue);
                        }}
                        sx={{ 
                            zIndex: 1000,
                            '& .MuiSlider-mark': {
                                height: '8px',
                                width: '1px',
                                marginTop: '-3px',
                            },
                            '& .MuiSlider-markLabel': {
                                top: '20px',
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}