"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapView from "@/app/components/MapView";
import Chat from "./components/Chat";
import { GraphItem } from "./KnowledgeGraphItem";
import ConnectionsPanel from "./components/ConnectionsPanel";

export default function Home() {
    const [clickedChatItem, setClickedChatItem] = useState<GraphItem>();

    return (
      <main className="min-h-screen w-full"> {/*className="flex min-h-screen flex-col items-center justify-between p-24"> */}
            <section className="grid grid-rows-4 grid-cols-3 grid-flow-col gap-4 min-h-screen">
              <div className="bg-blue-700 col-span-2 row-span-4">
                  <MapView />

              </div>

              <div className="bg-blue-700 row-span-2">
                  <Chat setClickedChatItem={setClickedChatItem} />


              </div>
              <div className="bg-blue-700 row-span-2">
                  <ConnectionsPanel clickedChatItem={clickedChatItem}/>
              </div>
          </section>
      </main>
  );
}
