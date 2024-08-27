import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const NextHistoricalEventResponse = z.object({
    // topic: z.string(),
    dates: z.string().array().describe('dates for the events described in the narrative in the order they were talked about'),
    // location: z.string().array().describe('an array of strings representing specific locations to drop pins on in order of they were talked about'),
    latlongs: z.string().array().describe('specific, modern day locations for the events described in the narrative in the order they were talked about'),
    narration: z.string().array().describe('a detailed, narrative style description of the historical event or civilization broken into chunks'),
})

export async function POST(request: Request) {
    let prevMsg = await request.json();
    let data = {
        "model": "gpt-4o-mini",
        // this isnt a conversation. can shorten?
        "messages": [
            {
                "role": "system",
                "content": "i will ask you to provide the next event in a timeline of historical events. i will give you an event with the following info: topic, date, location, and blurb about a historical event in this example format: politics_1871_new york city,United States of America_something that happened in 1871 in new york city related to politics. you will respond with a blurb of 1-3 sentences describing a historical event of at least some significance within a 1-5 years, at least somewhat close to the location (prioritizing events in a different location but same area), and related to the topic + event in the json format i gave. try to be as specific as possible about the location to ensure no doubt about where you are talking about. for example to talk about paris, write 'Paris, France'. here is the prompt: " + prevMsg
            }
        ],
        "response_format": zodResponseFormat(NextHistoricalEventResponse, "next_historical_event_response") 
    };

    let reqHeaders = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_KEY
    }

    return await axios.post('https://api.openai.com/v1/chat/completions',
        data,
        { headers: reqHeaders }
    )
        .then((r) => {
            return new NextResponse(r.data.choices[0].message.content);
        })
        .catch((err) => {
            console.log(err);
            return new NextResponse(err);
        })
}

export async function GET(req: NextRequest) {
    // let location = req.nextUrl.searchParams.get('location');
    // let date = req.nextUrl.searchParams.get('date');
    let topic = req.nextUrl.searchParams.get('topic');

    let prompt = `Tell me about the following topic in a detailed, narrative style. Incorporate a sense of wonder and exploration, similar to a David Attenborough documentary. Imagine the audience is following along with an interactive map, where each key location or event you mention corresponds to a pin being dropped on the map. Provide the specific location name in the field for each event. The topic is: ${topic}.`;

    let data = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": prompt
            }
        ],
        "response_format": zodResponseFormat(NextHistoricalEventResponse, "next_historical_event_response") 
    };

    let reqHeaders = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_KEY
    }

    return await axios.post('https://api.openai.com/v1/chat/completions',
        data,
        { headers: reqHeaders }
    ).then((r) => {
        return new NextResponse(r.data.choices[0].message.content);
    }).catch((err) => {
        console.log(err.response.data);
        return new NextResponse(err);
    })

}