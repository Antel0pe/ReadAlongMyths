"use client";

import { ReactNode, useMemo } from 'react';
import dynamic from "next/dynamic";
import { GraphItem } from '../utils/KnowledgeGraphItem';
import { EventLocation } from '../utils/EventLocation';
import { LatLngExpression } from 'leaflet';

type Props = {
    eventLocations: EventLocation[],
    zoomToNewestMarker: boolean,
    linePositions: number[][] | number[][][],
    children?: ReactNode,
}


export default function MapView({ eventLocations, zoomToNewestMarker, linePositions, children }: Props) {
    const Map = useMemo(() => dynamic(
      () => import('@/app/components/Map'),
      { 
        loading: () => <p>A map is loading</p>,
        ssr: false
      }
    ), [])
  
    return (
        <Map eventLocations={eventLocations} zoomToNewestMarker={zoomToNewestMarker} linePositions={linePositions} children={children} />
    )
  }