'use client';

import { Dispatch, MouseEventHandler, ReactElement, ReactFragment, useEffect, useState } from "react";
import { GraphItem, graphItemToOpenAIFormat, openAIFormatToGraphItem } from "../utils/KnowledgeGraphItem";
import { getNextChatItem, getNextOptionItems } from "../utils/KnowledgeGraphController";
import { EventLocation } from "../utils/EventLocation";
import { StartTimeline } from "./StartTimeline";

type Props = {
    setClickedChatItem: Dispatch<EventLocation>,
    eventLocations: EventLocation[],
    setEventLocations: Dispatch<EventLocation[]>,
}

export default function Chat( { setClickedChatItem, eventLocations, setEventLocations }: Props ) {
    const [msgs, setMsgs] = useState<GraphItem[]>([]);
    const [optionItems, setOptionItems] = useState<GraphItem[]>([]);
    
    const [submittedUserDate, setSubmittedUserDate] = useState('');
    const [submittedUserLocation, setSubmittedUserLocation] = useState('');
    const [submittedUserTopic, setSubmittedUserTopic] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    
    // get 1st msg in chat on load
    // useEffect(() => {
    //     setMsgs([getNextChatItem(null)]);
    // }, [])

    // get next option items when new msg is seen
    // useEffect(() => {
    //     setOptionItems(getNextOptionItems(msgs[msgs.length-1]));
    // }, [msgs])

    useEffect(() => {
        if (isFormSubmitted) {
            setIsLoading(true);
        }
    }, [isFormSubmitted]);

    // scroll into view when new msg added
    useEffect(() => {
        let chat = document.getElementById('chat');
        if (chat) {
            chat.scrollTop = chat.scrollHeight;
        }

    }, [JSON.stringify(msgs)])

    // update array of locations everytime msgs are updated
    useEffect(() => {
        if (msgs.length >= 1) {
            let lastMsg = msgs[msgs.length - 1];
            fetch('/api/location?' + new URLSearchParams({
                location: lastMsg.place
            }), {
                method: 'GET',
            }).then((res) => {
                res.json().then((r) => {
                    setEventLocations([...eventLocations, { lat: r.lat, long: r.long, text: lastMsg.date }]);
                })
            }).catch((e) => {
                console.log(e);
                alert('Something went wrong with placing the map marker. Please wait a few seconds then retry.')
            }).finally(() => {
                setIsLoading(false);
            });
        }
    
    }, [JSON.stringify(msgs)])

    // when user submits a location + date, make req for 1st msg
    useEffect(() => {
        if (submittedUserLocation.length === 0 || submittedUserDate.length === 0) return;

        fetch('/api/events?' + new URLSearchParams({
            location: submittedUserLocation,
            date: submittedUserDate,
            topic: submittedUserTopic,
        }),
        {
            method: "GET"
        }).then((res) => {
            res.json().then((json) => {
                console.log(json);
                let graphItemMsg = openAIFormatToGraphItem(json);
                setMsgs([...msgs, graphItemMsg]);
            });


        })
        .catch((err) => {
            console.log(err.response);
            alert('Something went wrong with Open AI...');
        })
        .finally(() => {
            setIsLoading(false);
        });

    }, [isFormSubmitted])

    function handleClickedChatItem(i: number) {
        const correspondingEventLocation = eventLocations[i];
        setClickedChatItem({
            lat: correspondingEventLocation?.lat,
            long: correspondingEventLocation?.long,
            text: msgs[i].blurb
        });
    }

    function msgFrag(msg: GraphItem, i: number): JSX.Element {
        const backgroundColor = i % 2 === 0 ? 'bg-green-100' : 'bg-orange-100';
        
        return (
            <div className={`w-full p-4 rounded-lg shadow-md ${backgroundColor}`}>
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{msg.date}</span>
                        <span>{msg.place}</span>
                    </div>
                    <p className="text-lg font-medium">
                        <a 
                            href="#" 
                            onClick={() => handleClickedChatItem(i)} 
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                            {msg.blurb}
                        </a>
                    </p>
                </div>
            </div>
        )
    }

    function getPrevMsg(): string {
        return submittedUserTopic + '_' + graphItemToOpenAIFormat(msgs[msgs.length - 1]);
    }

    function getNextOpenAIResponse() {
        setIsLoading(true);
        // let temp = '1774_philadelphia, USA_first continental congress met in philadelphia and passed the continental association';
        // let openAIFormat = graphItemToOpenAIFormat(msgs[msgs.length - 1]);
        
        fetch('/api/events', {
            method: "POST",
            body: JSON.stringify(getPrevMsg())
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((msg) => {
                console.log(msg);
                let graphItemMsg = openAIFormatToGraphItem(msg);
                setMsgs([...msgs, graphItemMsg]);
            })
            .catch((err) => {
                console.error('Error:', err);
                alert('An error occurred while fetching data. Please try again.');
            });
    }

    return (
        <>
            <div className="relative h-full flex flex-col">
                <div>
                    <h1>Chat</h1>
                </div>
                <div id="chat" className="overflow-y-scroll flex-grow h-0 p-4 space-y-4">
                    {msgs.map((m, i) => (
                        <div key={i} className="flex justify-end">
                            <div className="max-w-3/4 bg-blue-500 text-white rounded-lg p-3 shadow-md">
                                {msgFrag(m, i)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full flex flex-row">
                    <StartTimeline setSubmittedUserDate={setSubmittedUserDate} setSubmittedUserLocation={setSubmittedUserLocation} isFormSubmitted={isFormSubmitted} setSubmittedUserTopic={setSubmittedUserTopic} setIsFormSubmitted={setIsFormSubmitted}/>

                    <button 
                        className="border-2 flex-grow" 
                        onClick={getNextOpenAIResponse} 
                        hidden={!isFormSubmitted}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                getNextOpenAIResponse();
                            }
                        }}
                        tabIndex={0}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Next'}
                    </button>
                    {/* {optionItems.length !== 0 && 
                        optionItems.map((o, i) => {
                            // FIX KEY
                            return <button key={i} className={"border-2 basis-1/3"} onClick={() => addMsg(i)}>{ o.blurb }</button>
                        })
                    } */}
                </div>
            </div>
        </>
    )
}