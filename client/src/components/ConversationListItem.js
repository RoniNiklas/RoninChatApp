import React from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

const ConversationItem = (props) => {
    return (
        <div className="card" style={{ width: "300px", maxWidth: '300px', height: "300px", maxHeight: "300px", margin: "10px", display: "inline-block" }}>

            <div className="card-header">{props.conversation.title}</div>
            <div className="card-body">
                <img className="card-img-top" src="holder.js/100px180" style={{maxHeight:"30%"}} />
                <div className="card-text" >
                    Description:
                    {props.conversation.description}
                </div>
            </div>
            <div className="card-footer" style={{ position: "absolute", bottom: 0, width: "100%" }} >
                <Link to={"/conversations/" + props.conversation.id}> <Button variant="primary">Open Conversation</Button> </Link>
            </div>
        </div>
    )
}
export default ConversationItem