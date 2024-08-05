export interface GraphItem{
    entity: string,
    date: string,
    place: string,
    blurb: string,
}

export function openAIFormatToGraphItem(res: string): GraphItem {
    let split_res = res.split('_');

    return {
        entity: 'placeholder',
        date: split_res[0],
        place: split_res[1],
        blurb: split_res[2],
    }
}

export function graphItemToOpenAIFormat(item: GraphItem): string{
    return item.date + '_' + item.place + '_' + item.blurb;
}