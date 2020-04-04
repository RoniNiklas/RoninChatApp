import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Alert from "react-bootstrap/Alert"
import { useHistory } from "react-router-dom"

const ConferenceLobby = ({ setName }) => {
    const [newName, setNewName] = useState("")
    const [error, setError] = useState()
    const history = useHistory()
    const handleChange = (input) => {
        setNewName(input)
    }

    const handleCancel = () => {
        history.goBack()
    }

    const handleSubmit = () => {
        newName.trim()
            ? handleNameChange(newName)
            : setError("Name can't be empty")
    }

    const handleNameChange = (name) => {
        setName(name)
        localStorage.setItem("name", name)
        history.goBack()
    }
    
    return (
        <Modal show={true}>
            <Modal.Header> Select a name before continuing </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={(event) => event.preventDefault()}>
                    <Form.Group>
                        <Form.Control
                            value={newName}
                            type="text"
                            placeholder="Your name"
                            onChange={(event) => handleChange(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Text>
                        Note: The name you enter here will be saved on your computer for future use. The name can be changed at any time via the button in the menu bar.
                    </Form.Text>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => handleCancel()}>Cancel</button>
                <button onClick={() => handleSubmit()}>Continue</button>
            </Modal.Footer>
        </Modal>

    )
}

export default ConferenceLobby
