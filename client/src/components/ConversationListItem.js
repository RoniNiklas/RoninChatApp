import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from "react-bootstrap/Card"
import { Link } from 'react-router-dom'
import './ConversationListItem.css';

const ConversationItem = ({ conversation }) => {
    const image = conversation.image
    return (
        <>
            <div id="all">
                <div className="view view-first">
                    <Link to={"/conversations/" + conversation.id}>
                        <img src={image} />
                        <div className="mask">
                            <h2 className="visible">{conversation.title}</h2>
                            <p>{conversation.description}</p>
                            <a className="info">Join</a>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}
export default ConversationItem