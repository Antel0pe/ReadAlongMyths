'use client'

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapView from "@/app/components/MapView";
import Chat from "./components/Chat";
import { GraphItem } from "./utils/KnowledgeGraphItem";
import ConnectionsPanel from "./components/ConnectionsPanel";
import { EventLocation } from "./utils/EventLocation";
import MapViewWithTimeline from "./components/MapViewWithTimeline";

export default function Home() {
    const [clickedChatItem, setClickedChatItem] = useState<EventLocation | undefined>();
    const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);
    const [eventPositions, setEventPositions] = useState<number[][]>([]);

    const [timelineSliderValue, setTimelineSliderValue] = useState<number>(0);

    useEffect(() => {
        let pos: number[][] = [];

        for (let i = 0; i < eventLocations.length; i++){
            pos.push([eventLocations[i].lat, eventLocations[i].long]);
        }

        setEventPositions(pos);
    }, [JSON.stringify(eventLocations)])

    // function mapEventLocationsToPositions() {
    //     let pos = [];

    //     for (let i = 0; i < eventLocations.length; i++){
    //         pos.push(new LatLng(eventLocations[i].lat, eventLocations[i].long))
    //     }

    //     return pos;
    // }

    return (
        <main className="h-full w-full"> {/*className="flex min-h-screen flex-col items-center justify-between p-24"> */}
            <section className="grid grid-rows-4 grid-cols-3 grid-flow-col gap-4 h-full">
              <div className="h-full bg-blue-700 col-span-2 row-span-4">
                    {/* {eventLocations && eventLocations.length > 0 && ( */}
                        <MapViewWithTimeline eventLocations={eventLocations} zoomToNewestMarker={true} linePositions={eventPositions} clickedChatItem={clickedChatItem} 
                            sliderValue={timelineSliderValue} setSliderValue={setTimelineSliderValue}/>
                    {/* )} */}
              </div>

              <div className="bg-blue-700 row-span-4">
                    <Chat setClickedChatItem={setClickedChatItem} displayedEventLocations={eventLocations} setDisplayedEventLocations={setEventLocations} 
                        timelineSliderValue={timelineSliderValue}
                    />


              </div>
              {/* <div className="bg-blue-700 row-span-2">
                  <ConnectionsPanel clickedChatItem={clickedChatItem}/>
              </div> */}
          </section>
      </main>
  );
}
