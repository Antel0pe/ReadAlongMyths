import { getRelatedEntities } from "../KnowledgeGraphController"
import { GraphItem } from "../KnowledgeGraphItem"


type Props = {
    clickedChatItem : GraphItem | undefined,
}

export default function ConnectionsPanel({ clickedChatItem }: Props) {
    return (
        <div>
            <h2>All Connections for Selected Thing</h2>

            {clickedChatItem && 
                <>
                    <p>Entity: {clickedChatItem.entity}</p>
                    <p>Place: {clickedChatItem.place}</p>
                    <p>Date: {clickedChatItem.date}</p>
                    <p>blurb: {clickedChatItem.blurb}</p>
                
                    <br/>
                    <h4>Related Entities </h4>
                    <li>
                    {getRelatedEntities(clickedChatItem.entity).map((e, i) => {
                            // FIX KEY
                            return <ul key={i}>{e}</ul>
                        })}
                    </li>
                </>
            }

        </div>
    )
}