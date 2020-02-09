import React from 'react'
import { Link } from 'react-router-dom'
import './ConversationListItem.css';

const ConversationItem = ({ conversation }) => {
    return (
        <>
            <div id="all">
                <div className="view view-first">
                    <Link to={"/conversations/" + conversation.id}>
                        <img src={conversation.image} alt="Conversation image" />
                        <div className="mask">
                            <h2>{conversation.title}</h2>
                            <p>{conversation.description}</p>
                            <p className="info">Join</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ConversationItem
