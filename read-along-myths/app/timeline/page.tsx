'use client'

import MapView from "../components/MapView";
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import earlyHumanMigrationModel from "../utils/earlyHumanMigrations";
import { useEffect, useState } from "react";
import { EventLocation } from "../utils/EventLocation";

export default function Timeline() {
    const [displayedMarkers, setDisplayedMarkers] = useState<EventLocation[]>([]);
    const [linePositions, setLinePositions] = useState<number[][][]>([]);
    
    function onSliderChange(v: number | number[]) {
        let val = typeof (v) === 'number' ? Math.abs(v) : Math.abs(v[0]);
        
        let currentYears = earlyHumanMigrationModel.data
            .filter((i) => {
                return i.year >= val;
            });
        
        let lineOrigins = drawLineForDisplayedDates(currentYears);
        setLinePositions(lineOrigins);
        
        let displayedDates: EventLocation[] = currentYears.map((i) => {
                return {
                    lat: i.lat,
                    long: i.long,
                    text: i.year.toString(),
                }
            });
        
        setDisplayedMarkers(displayedDates);
    }

    function drawLineForDisplayedDates(displayedDates: any[]) {
        let lineOrigins: number[][][] = [];

        for (let i = 0; i < displayedDates.length; i++){
            let originatingKey = displayedDates[i].origin;

            // starter point, no originating point
            if (originatingKey < 0) continue;

            let originatingPoint = displayedDates.filter((i) => i.key === originatingKey)[0];

            let line: number[][] = [
                [originatingPoint.lat, originatingPoint.long],
                [displayedDates[i].lat, displayedDates[i].long]
            ];

            lineOrigins.push(line);
        }

        return lineOrigins;
    }

    return (
        <main className="h-full w-full">
            <div className="bg-blue-700 h-full flex flex-col">
                <div className="grow z-0">
                    <MapView eventLocations={displayedMarkers} zoomToNewestMarker={false} linePositions={linePositions}  clickedChatItem={undefined}/>
                    
                </div>
                <div className="h-20 z-10 m-auto w-5/6">
                        <p className="text-center">Timeline</p>
                        <Slider defaultValue={-100} aria-label="Default" valueLabelDisplay="auto" min={-200} max={0} onChange={(_,v) => onSliderChange(v)}  />
                </div>

            </div>
        </main>
    )
    
}