"use client";

import { useMemo } from 'react';
import dynamic from "next/dynamic";
import { GraphItem } from '../utils/KnowledgeGraphItem';
import { EventLocation } from '../utils/EventLocation';

type Props = {
    eventLocations: EventLocation[],
}


export default function MapView({ eventLocations }: Props) {
    const Map = useMemo(() => dynamic(
      () => import('@/app/components/Map'),
      { 
        loading: () => <p>A map is loading</p>,
        ssr: false
      }
    ), [])
  
    return (
        <Map eventLocations={eventLocations}/>
    )
  }