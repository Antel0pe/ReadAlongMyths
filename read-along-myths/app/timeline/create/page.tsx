'use client'

import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import MapView from '@/app/components/MapView';
import earlyHumanMigrationModel from '@/app/utils/earlyHumanMigrations';
import { EventLocation } from '@/app/utils/EventLocation';
import EditableMap from '@/app/components/EditableMap';

export default function Timeline() {
    const [displayedMarkers, setDisplayedMarkers] = useState<EventLocation[]>([]);
    const [linePositions, setLinePositions] = useState<number[][][]>([]);


    return (
        <main className="h-full w-full">
            <div className="bg-blue-700 h-full flex flex-col">
                <div className="grow z-0">
                    <MapView eventLocations={displayedMarkers} zoomToNewestMarker={false} linePositions={linePositions} >
                        <EditableMap eventLocations={displayedMarkers} linePositions={linePositions} setDisplayedMarkers={setDisplayedMarkers} setLinePositions={setLinePositions}  />
                    </MapView>
                </div>
                <div className="h-20 z-10 m-auto w-5/6">
                        <p className="text-center">Timeline</p>
                        <Slider defaultValue={-100} aria-label="Default" valueLabelDisplay="auto" min={-200} max={0}  />
                </div>

            </div>
        </main>
    )
    
}