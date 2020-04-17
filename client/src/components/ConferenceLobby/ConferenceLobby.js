import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Alert from "react-bootstrap/Alert"
import { useHistory } from "react-router-dom"

const ConferenceLobby = ({ setName, devices, setDevices, setPassword }) => {
    const [newName, setNewName] = useState(localStorage.getItem('name') || "")
    const [newPassword, setNewPassword] = useState("")
    const [error, setError] = useState("")
    const history = useHistory()
    const handleChange = (input) => {
        setNewName(input)
    }
    const handleCancel = () => {
        history.goBack()
    }
    const handleSubmit = () => {
        (newName.trim() && newPassword.trim())
            ? enterConference()
            : setError("Neither name or password can be empty")
    }

    const enterConference = () => {
        setName(newName)
        setPassword(newPassword)
        localStorage.setItem("name", newName)
    }

    return (
        <Modal show={true} onHide={() => {}}>
            <Modal.Header> Select a name before continuing </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={(event) => event.preventDefault()}>
                    <Form.Group>
                        <Form.Label htmlFor="name">Your name</Form.Label>
                        <Form.Control
                            value={newName}
                            type="text"
                            placeholder="Your name"
                            onChange={(event) => handleChange(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="password">Password for the Conference</Form.Label>
                        <Form.Control
                            value={newPassword}
                            type="text"
                            placeholder="Password for the Conference"
                            onChange={(event) => setNewPassword(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Check
                        id="audioSwitch"
                        type="switch"
                        disabled={devices ? !devices.available.audio: true}
                        checked={devices ? devices.chosen.audio : false}
                        onChange={() => setDevices({ ...devices, chosen: { ...devices.chosen, audio: !devices.chosen.audio } })}
                        label="Enable Microphone"
                    />
                    <Form.Check
                        id="videoSwitch"
                        type="switch"
                        disabled={devices ? !devices.available.video : true}
                        checked={devices ? devices.chosen.video: false}
                        onChange={() => setDevices({ ...devices, chosen: { ...devices.chosen, video: !devices.chosen.video } })}
                        label="Enable Camera"
                    />
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
