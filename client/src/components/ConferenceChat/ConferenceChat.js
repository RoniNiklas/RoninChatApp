import React, { useState, useEffect, useRef } from 'react'
import Alert from "react-bootstrap/Alert"
import CommentInput from '../CommentInput/CommentInput'
import MessageList from "../MessageList/MessageList"

import "./ConferenceChat.css"

const ConferenceChat = ({ socket, id, name}) => {
    const [messages, setMessages] = useState([])
    const messagesRef = useRef([])
    const [error, setError] = useState("")
    const bottom = useRef()
    const top = useRef()

    useEffect(() => {
        socket.on("UPDATE_CONFERENCE", comment => {
            console.log("RECEIVED", comment)
            messagesRef.current = messagesRef.current.concat([comment])
            setMessages(messagesRef.current)
        })
        socket.on("SET_ERROR", (error) => {
            setError(error)
        })
    }, [])

    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)
    const goToLast = () => scrollToRef(bottom)
    const goToTop = () => scrollToRef(top)


    return (
        <>
            {error && <Alert variant='danger' className="conversation-view-error">{error}</Alert>}
            <div className="conference-chat">
                <div className="conference-messages">
                    <div ref={top} className="invisible" />
                    <MessageList messages={messages} />
                    <div ref={bottom} className="invisible anchor" />
                </div>
                <CommentInput setError={setError} goToLast={goToLast} id={id} socket={socket} name={name} />
            </div>
        </>
    )
}
export default ConferenceChat
