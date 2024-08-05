import axios from "axios";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    let location = req.nextUrl.searchParams.get('location');

    let params = {
        q: location,
        format: 'json',
        key: process.env.LOCATIONIQ_KEY
    }

    return await axios.get('https://us1.locationiq.com/v1/search',
        { params: params }
    ).then((r) => {
        let res = { lat: r.data[0].lat, long: r.data[0].lon };
        return new NextResponse(JSON.stringify(res));
    }).catch((e) => {
        console.log(e);
        return new NextResponse(e);
    })
}