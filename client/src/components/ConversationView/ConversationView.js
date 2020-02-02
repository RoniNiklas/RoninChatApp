import React, { useState, useEffect, useRef } from 'react'
import openSocket from "socket.io-client"
import { useImmer } from 'use-immer'
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Spinner from '../Spinner'
import CommentInput from './CommentInput'
import MessageList from "./MessageList"
import useWindowDimensions from '../../utils/useWindowDimensions'


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
                console.log("SETTING CONVERSATION", newConversation)
                console.log("SETTING CONVERSATION MESSAGES", newConversation.messages)
                setConversation(newConversation)
                setMessages(draft => {
                    newConversation.messages.map(msg => draft.push(msg))
                })
            })
            openedSocket.on("UPDATE_CONVERSATION", (newComment) => {
                console.log("UPDATING CONVERSATION", newComment)
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

        goToLast()

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
            <div className="container" style={{ textAlign: "left" }}>
                <div className="row" >
                    <div className="col" style={{ width: "100%", margin: "auto" }}>
                        <h5 style={{ width: "100%", margin: "auto" }}>{conversation.title}</h5>
                        <Button onClick={goToLast}>Go to last</Button>
                        {error ? <Alert variant='danger' style={{ position: "fixed", top: 0, left: 0, right: 0 }}>{error}</Alert> : null}
                        <div ref={top} style={{ visibility: "hidden", height: "1px", float: "left", clear: "both" }} />
                        {messages
                            ? <MessageList messages={messages} />
                            : <Spinner />
                        }
                        <div ref={bottom} style={{ visibility: "hidden", height: "1px", float: "left", clear: "both" }} />
                        <Button onClick={goToTop}>Go to top</Button>
                    </div>
                </div>
            </div>
            <div className="container" style={{ maxHeight: (height / 3.5), height: (height / 3.5) }}>
                <CommentInput setError={setError} goToLast={goToLast} propsId={id} socket={socket} />
            </div >
        </>
    )
}
export default ConversationView