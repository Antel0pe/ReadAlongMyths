import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapView from "@/app/components/MapView";

export default function Home() {
  return (
      <main className="min-h-screen w-full"> {/*className="flex min-h-screen flex-col items-center justify-between p-24"> */}
          <section className="grid grid-rows-4 grid-cols-3 grid-flow-col gap-4 min-h-screen">
              <div className="bg-blue-700 col-span-2 row-span-3">
                  <MapView />

              </div>

              <article className="p-10 m-10 bg-blue-700 col-span-2">
                  <h2>Path</h2>

              </article>

              <article className="p-10 m-10 bg-blue-700 row-span-2">
                  <h2>Chat</h2>


              </article>
              <article className="p-10 m-10 bg-blue-700 row-span-2">
                  <h2>All Connections for Selected Thing</h2>
              </article>
          </section>
      </main>
  );
}
