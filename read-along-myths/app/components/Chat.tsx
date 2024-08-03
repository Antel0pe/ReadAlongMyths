'use client';

import { Dispatch, MouseEventHandler, ReactElement, ReactFragment, useEffect, useState } from "react";
import { GraphItem } from "../KnowledgeGraphItem";
import { getNextChatItem, getNextOptionItems } from "../KnowledgeGraphController";

type Props = {
    setClickedChatItem : Dispatch<GraphItem>,
}

export default function Chat( { setClickedChatItem }: Props ) {
    const [msgs, setMsgs] = useState<GraphItem[]>([]);
    const [optionItems, setOptionItems] = useState<GraphItem[]>([]);

    useEffect(() => {
        setMsgs([getNextChatItem(null)]);
    }, [])

    useEffect(() => {
        setOptionItems(getNextOptionItems(msgs[msgs.length-1]));
    }, [setMsgs])

    function handleClickedChatItem(i: number) {
        setClickedChatItem(msgs[i]);
    }

    function msgFrag(msg: string, i: number): JSX.Element{
        return (
            <div className="w-full">
                <p>msg <a href="#" onClick={() => handleClickedChatItem(i)} className="text-green-300 ">{msg}</a> ...</p>
            </div>
        )
    }

    function addMsg(i: number) {
        setMsgs([...msgs, getNextChatItem(optionItems[i])]);
    }

    return (
        <div className="relative h-full flex flex-col">
            <div>
            <h1>Chat</h1>
            </div>
            <div id="chat" className="overflow-y-scroll flex-grow h-0">
                {msgs.map((m, i) => {
                    return msgFrag(m.blurb, i);
                })

                }
            </div>
            <div className="w-full flex flex-row">
                {optionItems.length !== 0 && 
                    optionItems.map((o, i) => {
                        return <button className={"border-2 basis-1/3"} onClick={() => addMsg(i)}>{ o.blurb }</button>
                    })
                }
            </div>
            
        </div>
    )
}