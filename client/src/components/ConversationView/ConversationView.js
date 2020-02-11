import React, { useState, useEffect, useRef } from 'react'
import openSocket from "socket.io-client"
import { useImmer } from 'use-immer'
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Sidebar from "./Sidebar/Sidebar"
import CommentInput from './CommentInput/CommentInput'
import MessageList from "./MessageList/MessageList"
import useWindowDimensions from '../../utils/useWindowDimensions'
import "./ConversationView.css"


const ConversationView = (props) => {
    const [conversation, setConversation] = useState({})
    const [messages, setMessages] = useImmer([])
    const [id] = useState(props.match.params.id)
    const [error, setError] = useState("")
    const [socket, setSocket] = useState(null)
    const { height, width } = useWindowDimensions();
    const bottom = useRef(null)
    const top = useRef(null)

    useEffect(() => {
        let openedSocket
        const openConnection = () => {
            openedSocket = openSocket((process.env.NODE_ENV === "production" ?
                "https://roninchatapp.herokuapp.com/" :
                "http://localhost:5000"))
            openedSocket.connect()
            openedSocket.emit("JOIN_ROOM", id)
            openedSocket.on("SET_CONVERSATION", (newConversation) => {
                setConversation(newConversation)
                setMessages(draft => {
                    newConversation.messages.map(msg => draft.push(msg))
                })
            })
            openedSocket.on("UPDATE_CONVERSATION", (newComment) => {
                setMessages(draft => {
                    draft.push(newComment)
                })
            })
            openedSocket.on("SET_ERROR", (error) => {
                setError(error)
            })
            setSocket(openedSocket)
        }
        if (!socket) {
            openConnection()
        }

        return function cleanup() {
            openedSocket.emit("LEAVE_ROOM", id)
            openedSocket.disconnect()
        }
    }, [])

    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)
    const goToLast = () => scrollToRef(bottom)
    const goToTop = () => scrollToRef(top)

    return (
        <>
            {error && <Alert variant='danger' className="conversation-view-error">{error}</Alert>}
            <div className="conversation-view">
                <div className="sidebar-and-messages">
                    <Sidebar conversation={conversation} goToTop={goToTop} goToLast={goToLast} width={width} />
                    <div
                        className="messages"
                        style={{
                            marginBottom: (width > 720 ? height / 4 + "px" : height / 3 + "px")
                        }}
                    >
                        <div ref={top} className="invisible" />
                        <MessageList messages={messages} width={width} />
                        <div ref={bottom} className="invisible" />
                    </div>
                </div>
                <CommentInput setError={setError} goToLast={goToLast} propsId={id} socket={socket} />
            </div>
        </>
    )
}
export default ConversationView