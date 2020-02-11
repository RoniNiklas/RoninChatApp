import React from "react"
import Card from "react-bootstrap/Card"
import { Link } from 'react-router-dom'
import "./ConversationListItem.css"

const ConversationItem = ({ conversation }) => {
    return (
        <>
            <Link to={"/conversations/" + conversation.id}>
                <Card className="card bg-dark text-white conversation-item">
                    <Card.Img src={conversation.image} className="image" alt="Card image" />
                    <Card.Header>{conversation.title}</Card.Header>
                </Card>
            </Link>
        </>
    )
}

export default ConversationItem
