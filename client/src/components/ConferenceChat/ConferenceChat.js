import React, { useState, useEffect, useRef } from 'react'
import Alert from "react-bootstrap/Alert"
import ArrowUp from '@material-ui/icons/KeyboardArrowUp'
import ArrowDown from "@material-ui/icons/KeyboardArrowDown"

import CommentInput from '../CommentInput/CommentInput'
import MessageList from "../MessageList/MessageList"

import "./ConferenceChat.css"

const ConferenceChat = ({ socket, id, name }) => {
    const [messages, setMessages] = useState([])
    const messagesRef = useRef([])
    const [error, setError] = useState("")
    const messagesList = useRef()

    useEffect(() => {
        socket.on("UPDATE_CONFERENCE", comment => {
            messagesRef.current = messagesRef.current.concat([comment])
            setMessages(messagesRef.current)
            comment.name === name && goTo("bottom")
        })
        socket.on("SET_ERROR", (error) => {
            setError(error)
        })
    }, [])

    const goTo = (pos) => {
        messagesList.current.scrollTop = (pos === "bottom")
            ? messagesList.current.scrollHeight
            : 0
    }


    return (
        <>
            {error && <Alert variant='danger' className="conversation-view-error">{error}</Alert>}
            <div className="conference-chat">
                <div className="messages-wrapper">
                    <button className="absolute top right popped arrow-button" onClick={() => goTo("top")}>
                        <ArrowUp />
                    </button>
                    <div className="conference-messages" ref={messagesList}>
                        <MessageList messages={messages} />
                    </div>
                    <button className="absolute bottom right popped arrow-button" onClick={() => goTo("bottom")}>
                        <ArrowDown />
                    </button>
                </div>


                <CommentInput setError={setError} id={id} socket={socket} name={name} />
            </div>
        </>
    )
}
export default ConferenceChat
