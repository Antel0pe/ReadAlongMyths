"use client";

import { ReactNode, useMemo } from 'react';
import dynamic from "next/dynamic";
import { GraphItem } from '../utils/KnowledgeGraphItem';
import { EventLocation } from '../utils/EventLocation';
import { LatLngExpression } from 'leaflet';
import { Dispatch } from 'react';

type Props = {
    eventLocations: EventLocation[],
    zoomToNewestMarker: boolean,
    linePositions: number[][] | number[][][],
    clickedChatItem: EventLocation | undefined,
    sliderValue: number,
    setSliderValue: Dispatch<number>,
    children?: ReactNode,
}


export default function MapView({ eventLocations, zoomToNewestMarker, linePositions, clickedChatItem, sliderValue, setSliderValue, children }: Props) {
    const Map = useMemo(() => dynamic(
      () => import('@/app/components/Map'),
      { 
        loading: () => <p>A map is loading</p>,
        ssr: false
      }
    ), [])
  
    return (
        <div className="w-full h-full">
            <Map eventLocations={eventLocations} zoomToNewestMarker={zoomToNewestMarker} linePositions={linePositions}
              clickedChatItem={clickedChatItem} sliderValue={sliderValue} setSliderValue={setSliderValue}
            >
                {children}
            </Map>
        </div>
    )
  }