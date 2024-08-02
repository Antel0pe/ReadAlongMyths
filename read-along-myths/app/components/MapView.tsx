"use client";

import { useMemo } from 'react';
import dynamic from "next/dynamic";

export default function MapView(props: any) {
    const Map = useMemo(() => dynamic(
      () => import('@/app/components/Map'),
      { 
        loading: () => <p>A map is loading</p>,
        ssr: false
      }
    ), [])
  
    return (
        <Map />
    )
  }