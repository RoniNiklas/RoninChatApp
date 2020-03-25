import React, { useState, useEffect } from "react"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { useHistory } from 'react-router-dom'
import AutoCompleteList from "../AutocompleteList/AutocompleteList"
import conversationService from "../../services/conversation"

const JoinConvoForm = ({showModal, setShowModal, autocompleteDelay = 500 }) => {
    const [title, setTitle] = useState("")
    const [suggestions, setSuggestions] = useState()
    const [timeoutHandle, setTimeoutHandle] = useState()
    const history = useHistory()

    useEffect(() => {
        return () => clearTimeout(timeoutHandle)
    })
    const handleChange = (input) => {
        setTitle(input)
        clearTimeout(timeoutHandle)
        setTimeoutHandle((setTimeout(async () => {
            input
                ? conversationService.autocomplete(input, setSuggestions)
                : setSuggestions()
        }, autocompleteDelay)))
    }

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} animation={false}>
                <Modal.Header closeButton>
                    Join a Conversation
                    </Modal.Header>
                <Modal.Body>
                    <Form className="joinconvoform" onSubmit={(event) => event.preventDefault()}>
                        <Form.Group>
                            <Form.Control
                                value={title}
                                type="text"
                                placeholder="Title of the Conversation"
                                onChange={(event) => handleChange(event.target.value)}
                            />
                            {suggestions && <AutoCompleteList suggestions={suggestions} handleClick={history.push} />}
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal >
        </>
    )
}

export default JoinConvoForm
