export interface GraphItem{
    entity: string,
    date: string,
    place: string,
    blurb: string,
}

export function openAIFormatToGraphItem(res: any): GraphItem {

    return {
        entity: 'placeholder',
        date: res.date,
        place: res.latlongs,
        blurb: res.blurb,
    }
}

export function graphItemToOpenAIFormat(item: GraphItem): string{
    return item.date + '_' + item.place + '_' + item.blurb;
}