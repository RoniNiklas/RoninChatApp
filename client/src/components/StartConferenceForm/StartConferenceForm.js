import React, { useState } from "react"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import { useHistory } from "react-router-dom"

import conferenceService from "../../services/conference"

const StartConferenceForm = ({ showModal, setShowModal }) => {
    const [error, setError] = useState("")
    const [password, setPassword] = useState("alfie")
    const history = useHistory()

    const postConference = async (event) => {
        event.preventDefault()
        if (password.trim()) {
            try {
                const conference = await conferenceService.add(password)
                console.log("conference", conference)
                history.push("/conference/"+ conference.id)
            } catch (error) {
                console.log(error.response)
                setError(error.response.data.message)
            }
        } else {
            setError("The password can not empty.")
        }
    }

    const handleClose = () => {
        setShowModal(false)
    }

    return (
        <Modal show={showModal} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Create a New Conference</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert className="alert alert-danger">{error}</Alert>}
                <Form onSubmit={postConference}>
                    <Form.Group>
                        <Form.Label htmlFor="password">Choose a password for the Conference</Form.Label>
                        <Form.Control autoComplete="off" type="text" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                    </Button>
                <Button variant="primary" onClick={postConference}>
                    Create
                    </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default StartConferenceForm