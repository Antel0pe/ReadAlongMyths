import { EventLocation } from "./EventLocation";

export interface TimelineEventLocation extends EventLocation{
    timeline: number,
}