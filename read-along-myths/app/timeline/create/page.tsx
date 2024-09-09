'use client'

import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { FormEventHandler, useEffect, useState } from "react";
import MapView from '@/app/components/MapView';
import earlyHumanMigrationModel from '@/app/utils/earlyHumanMigrations';
import { EventLocation } from '@/app/utils/EventLocation';
import EditableMap from '@/app/components/EditableMap';
import { TimelineEventLocation } from '@/app/utils/TimelineEventLocation';

export default function Timeline() {
    const [displayedMarkers, setDisplayedMarkers] = useState<TimelineEventLocation[]>([]);
    const [linePositions, setLinePositions] = useState<number[][][]>([]);

    const [textInput, setTextInput] = useState('');
    const [timelineInput, setTimelineInput] = useState('');
    const [deleteMarkerPath, setDeleteMarkerPath] = useState<string>('');

    const [clickedMarker, setClickedMarker] = useState<TimelineEventLocation | undefined>(undefined);

    const [timelineSliderValue, setTimelineSliderValue] = useState<number>(0);

    // sync metadata with clicked/unclicked marker
    useEffect(() => {
        if (clickedMarker) {
            setTextInput(clickedMarker?.text);
            setTimelineInput(clickedMarker?.timeline.toString());
            setDeleteMarkerPath(timelineEventString(clickedMarker));
        } else {
            setTextInput('');
            setTimelineInput('');
            setDeleteMarkerPath('');
        }
    }, [clickedMarker])

    function timelineEventString(e: TimelineEventLocation) {
        return e.timeline + ' ' + e.text;
    }

    function changeTextOfMarker() {
        if (clickedMarker) {
            displayedMarkers.map((m) => {
                if (m.lat === clickedMarker.lat && m.long === clickedMarker.long) {
                    m.text = textInput;
                }
            })

            setClickedMarker({
                ...clickedMarker,
                text: textInput,
            });
        }
    }

    function deleteClickedMarkerAndPaths() {
        if (clickedMarker) {
            setDisplayedMarkers(displayedMarkers.filter((e) => {
                return !(e.lat === clickedMarker.lat && e.long === clickedMarker.long)
            }));

            setLinePositions(linePositions.filter((l) => {
                l.every((i) => i[0] !== clickedMarker.lat && i[1] !== clickedMarker.long)
            }));

            setClickedMarker(undefined);
        }
        

    }

    function isLatLongEqualToTimeline(arr: number[], loc: TimelineEventLocation) {
        return arr[0] === loc.lat && arr[1] === loc.long;
    }

    // gross, clean up
    function deleteMarkerPathConnection(event: React.SyntheticEvent) {
        console.log('deleting')
        if (clickedMarker && deleteMarkerPath !== '') {
            let idx = parseInt(deleteMarkerPath.split('.')[0])
            let markerToDelete = displayedMarkers[idx];

            let linesNotEqualToDeletedMarker = [];
            for (let i = 0; i < linePositions.length; i++) {
                let l = linePositions[i];
                let isLinePosToBeDeleted = (isLatLongEqualToTimeline(l[0], markerToDelete) && isLatLongEqualToTimeline(l[1], clickedMarker)) || (isLatLongEqualToTimeline(l[0], clickedMarker) && isLatLongEqualToTimeline(l[1], markerToDelete));

                if (!isLinePosToBeDeleted) {
                    linesNotEqualToDeletedMarker.push(l);
                }
            }

            setLinePositions(linesNotEqualToDeletedMarker);
        }
    }


    return (
        <main className="h-full w-full">
            <div className="bg-blue-700 grid grid-rows-10 grid-cols-10 grid-flow-col gap-4 h-full">{/* <div className="bg-blue-700 h-full flex flex-col"> */}
                <div className="col-span-8 row-span-9 z-0">{/* <div className="grow z-0"> */}
                    <MapView clickedChatItem={clickedMarker} eventLocations={displayedMarkers} zoomToNewestMarker={false} linePositions={linePositions} 
                        sliderValue={timelineSliderValue} setSliderValue={setTimelineSliderValue}
                    >
                        <EditableMap eventLocations={displayedMarkers} linePositions={linePositions} setDisplayedMarkers={setDisplayedMarkers} setLinePositions={setLinePositions} setClickedMarker={setClickedMarker} />
                    </MapView>
                </div>
                <div className="col-span-8 row-span-1 z-10 w-5/6 m-auto">{/* <div className="h-20 z-10 m-auto w-5/6"> */}
                    <p className="text-center">Timeline</p>
                    <Slider defaultValue={-100} aria-label="Default" valueLabelDisplay="auto" min={-200} max={0} />
                </div>

                <div className='col-span-2 row-span-10'>
                    <p>Editor</p>
                    <div className=''>
                        <p>Text</p>
                        <input type='text' value={textInput} onChange={(e) => setTextInput(e.target.value)} className='text-black' disabled={clickedMarker === undefined} ></input>
                        <button type="button" className='border' onClick={changeTextOfMarker} >Submit </button>
                    </div>
                    <div className=''>
                        <p>Timeline</p>
                        <input type='text' value={timelineInput} onChange={(e) => setTimelineInput(e.target.value)} className='text-black' disabled={clickedMarker === undefined} ></input>
                        <button type="button" className='border' onClick={() => {
                            if (clickedMarker) {
                                clickedMarker.timeline = parseInt(timelineInput);
                            }
                        }}> Submit </button>
                    </div>
                    <div className=''>
                        <p>Delete path to/from</p>
                        <select value={deleteMarkerPath} onChange={(e) => setDeleteMarkerPath(e.target.value)}>
                            { clickedMarker &&
                                displayedMarkers.filter((m) => m.lat !== clickedMarker.lat && m.long !== clickedMarker.long)
                                    .map((e, i) => {
                                        return <option key={e.lat+','+e.long}>{ i + '. ' + timelineEventString(e) }</option>
                                    }
                            )}
                        </select>
                        <button type="button" className='border' onClick={deleteMarkerPathConnection} >Delete </button>
                    </div>
                    <div>
                    <button type="button" className='border' onClick={deleteClickedMarkerAndPaths} disabled={clickedMarker === null} >Delete Marker </button>
                    </div>
                </div>

            </div>
        </main>
    )
    
}