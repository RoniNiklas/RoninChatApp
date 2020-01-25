import React, { useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import conversationService from '../services/conversation'
import { useHistory } from 'react-router-dom'

const NewConversationForm = () => {
    const [show, setShow] = useState(true)
    const [conversationTitle, setConversationTitle] = useState("")
    const [conversationDescription, setConversationDescription] = useState("")
    const history = useHistory()

    const postConversation = async (e) => {
        e.preventDefault();
        const conversation = {}
        conversation.title = conversationTitle
        conversation.description = conversationDescription
        const savedConversation = await conversationService.add(conversation)
        history.push("/conversations/" + savedConversation.id)
    }

    const handleClose = () => {
        setShow(false)
        history.push("/")
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new conversation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="postForm">
                        <form onSubmit={postConversation}>
                            <label htmlFor="conversationTitle">Title for the Conversation: </label>
                            <input type="text" name="conversationTitle" onChange={e => setConversationTitle(e.target.value)} />
                            <label htmlFor="conversationDescription">Description of the Conversation: </label>
                            <input type="text" name="conversationTitle" onChange={e => setConversationDescription(e.target.value)} />
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={postConversation}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default NewConversationForm