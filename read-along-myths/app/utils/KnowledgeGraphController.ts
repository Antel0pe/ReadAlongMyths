import { GraphItem } from "./KnowledgeGraphItem";

export function getNextOptionItems(item: GraphItem): GraphItem[]{
    return [
        {
        entity: "4",
        date: "2",
        place: "3",
        blurb: "4",
        },
        {
            entity: "5",
            date: "2",
            place: "3",
            blurb: "5",
        },
        {
            entity: "6",
            date: "2",
            place: "3",
            blurb: "6",
        },
    ]
}

export function getNextChatItem(item: GraphItem | null): GraphItem {
    if (item === null) {
        return {
            entity: "6",
            date: "2",
            place: "3",
            blurb: "first msg",
        };
    } else {
        return {
            entity: "6",
            date: "2",
            place: "3",
            blurb: item.blurb,
        }; 
    }
    
}


export function getRelatedEntities(entity: string): Array<String> {
    let res = [];
    for (let i = 0; i < 3; i++){
        res.push((Math.random() + 1).toString(36).substring(7));
    }

    return res;
}