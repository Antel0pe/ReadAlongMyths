import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
    let prevMsg = await request.json();
    let data = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "i will ask you to provide the next event in a timeline of historical events. i will give you an event with the following info: date, location, and blurb about a historical event in this example format: 1871_new york city,United States of America_something that happened in 1871 in new york city. you will respond with a historical event of at least some significance within a few years, somewhat close to the location (prioritizing events with different location), and related to the event in the following format: 1872_new york city,United States of America_something else that happened in 1872 in new york city. try to be as specific as possible about the location to ensure no doubt about where you are talking about. for example to talk about paris, write 'Paris, France'. here is the prompt: " + prevMsg
            }
        ]
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
    let location = req.nextUrl.searchParams.get('location');
    let date = req.nextUrl.searchParams.get('date');

    let prompt = 'i will give you a place and time in history in the following format: place_date. you will return a historical event of at least some significance that happened near that place, around that time in the following format: date_location_event that happened. Prioritize info that most closely matches the prompt. try to be very specific with the location. the prompt is: ' + location + '_' + date;

    let data = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": prompt
            }
        ]
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
        console.log(err);
        return new NextResponse(err);
    })

}