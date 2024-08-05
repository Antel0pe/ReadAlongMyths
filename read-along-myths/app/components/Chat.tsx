'use client';

import { Dispatch, MouseEventHandler, ReactElement, ReactFragment, useEffect, useState } from "react";
import { GraphItem, graphItemToOpenAIFormat, openAIFormatToGraphItem } from "../utils/KnowledgeGraphItem";
import { getNextChatItem, getNextOptionItems } from "../utils/KnowledgeGraphController";
import { EventLocation } from "../utils/EventLocation";
import { StartTimeline } from "./StartTimeline";

type Props = {
    setClickedChatItem: Dispatch<GraphItem>,
    eventLocations: EventLocation[],
    setEventLocations: Dispatch<EventLocation[]>,
}

export default function Chat( { setClickedChatItem, eventLocations, setEventLocations }: Props ) {
    const [msgs, setMsgs] = useState<GraphItem[]>([]);
    const [optionItems, setOptionItems] = useState<GraphItem[]>([]);
    
    const [submittedUserDate, setSubmittedUserDate] = useState('');
    const [submittedUserLocation, setSubmittedUserLocation] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);



    // get 1st msg in chat on load
    // useEffect(() => {
    //     setMsgs([getNextChatItem(null)]);
    // }, [])

    // get next option items when new msg is seen
    // useEffect(() => {
    //     setOptionItems(getNextOptionItems(msgs[msgs.length-1]));
    // }, [msgs])

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
                    console.log('received ' + JSON.stringify(r));
                    setEventLocations([...eventLocations, { lat: r.lat, long: r.long, date: lastMsg.date }]);
                })
            }).catch((e) => {
                console.log(e);
                alert('Something went wrong with placing the map marker. Please wait a few seconds then retry.')
            })
        }
    
    }, [JSON.stringify(msgs)])

    // when user submits a location + date, make req for 1st msg
    useEffect(() => {
        if (submittedUserLocation.length === 0 || submittedUserDate.length === 0) return;

        fetch('/api/events?' + new URLSearchParams({
            location: submittedUserLocation,
            date: submittedUserDate,
        }),
        {
            method: "GET"
        }).then((res) => {
            res.text().then((msg) => {
                console.log(msg);
                let graphItemMsg = openAIFormatToGraphItem(msg);
                setMsgs([...msgs, graphItemMsg]);
            });

        })
        .catch((err) => {
            console.log(err);
            alert('Something went wrong with Open AI...');
        });

    }, [isFormSubmitted])

    function handleClickedChatItem(i: number) {
        setClickedChatItem(msgs[i]);
    }

    function msgFrag(msg: GraphItem, i: number): JSX.Element{
        // FIX KEY
        return (
            <div className="w-full">
                <p key={i} >[({msg.date}, {msg.place}) <a href="#" onClick={() => handleClickedChatItem(i)} className="text-white">{msg.blurb}</a> ]</p>
            </div>
        )
    }

    function getPrevMsg(): string {
        return graphItemToOpenAIFormat(msgs[msgs.length - 1]);
    }

    function getNextOpenAIResponse() {
        // let temp = '1774_philadelphia, USA_first continental congress met in philadelphia and passed the continental association';
        // let openAIFormat = graphItemToOpenAIFormat(msgs[msgs.length - 1]);
        
        fetch('/api/events', {
            method: "POST",
            body: JSON.stringify(getPrevMsg())
        })
            .then((res) => {
                res.text().then((msg) => {
                    console.log(msg);
                    let graphItemMsg = openAIFormatToGraphItem(msg);
                    console.log(graphItemMsg.place);
                    setMsgs([...msgs, graphItemMsg]);
                });

            })
            .catch((err) => {
                console.log(err);
                alert('Something went wrong with Open AI...');
            });
    }

    return (
        <div className="relative h-full flex flex-col">
            <div>
            <h1>Chat</h1>
            </div>
            <div id="chat" className="overflow-y-scroll flex-grow h-0">
                {msgs.map((m, i) => {
                    return msgFrag(m, i);
                })

                }
            </div>
            <div className="w-full flex flex-row">
                <StartTimeline setSubmittedUserDate={setSubmittedUserDate} setSubmittedUserLocation={setSubmittedUserLocation} isFormSubmitted={isFormSubmitted} setIsFormSubmitted={setIsFormSubmitted}/>

                <button className="border-2 flex-grow" onClick={getNextOpenAIResponse} hidden={!isFormSubmitted}>Next</button>
                {/* {optionItems.length !== 0 && 
                    optionItems.map((o, i) => {
                        // FIX KEY
                        return <button key={i} className={"border-2 basis-1/3"} onClick={() => addMsg(i)}>{ o.blurb }</button>
                    })
                } */}
            </div>
            
        </div>
    )
}