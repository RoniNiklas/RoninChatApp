import React, { useState, useEffect } from 'react'
import Spinner from './Spinner'
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import openSocket from "socket.io-client"
import { useImmer } from 'use-immer'


const ConversationView = (props) => {
    const [conversation, setConversation] = useState({})
    const [messages, setMessages] = useImmer([])
    const [id] = useState(props.match.params.id)
    const [error, setError] = useState("")
    const [comment, setComment] = useState("")
    const [socket, setSocket] = useState(null)

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

        return function cleanup() {
            openedSocket.emit("LEAVE_ROOM", id)
            openedSocket.disconnect()
        }
    }, [])


    const sendComment = (event) => {
        event.preventDefault()
        comment ? socket.emit("POST_COMMENT", id, comment) && setComment("") && setError("") : setError("Comment can't be empty")
    }
    return (
        <div className="container">
            <div className="row" style={{ width: "100%", margin: "auto" }} >
                <h5 style={{ width: "100%", textAlign: "center", margin: "auto" }}>{conversation.title}</h5>
                {error ? <Alert variant='danger'>{error}</Alert> : null}
                <div className="col-sm" style={{ width: "100%", margin: "auto" }}>
                    {messages ?
                        <div>
                            {messages.map(msg => {
                                return (<div>{msg}</div>)
                            })}
                        </div>
                        :
                        <Spinner />
                    }
                </div>
                <Form data-testid='addForm' onSubmit={(event) => sendComment(event)} className='comment-form'>
                    <Form.Group>
                        <Form.Label>Your Comment</Form.Label>
                        <Form.Control
                            type='text'
                            value={comment}
                            onChange={(event) => setComment(event.target.value)} />
                    </Form.Group>
                    <Button type="submit">Send comment</Button>
                </Form>
            </div>
        </div>
    );
}
export default ConversationView