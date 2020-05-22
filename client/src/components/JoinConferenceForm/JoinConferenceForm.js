import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { useHistory } from 'react-router-dom'

import conferenceService from "../../services/conference"

const JoinConferenceForm = ({ showModal, setShowModal }) => {
    const [error, setError] = useState("")
    const [title, setTitle] = useState("")
    const history = useHistory()

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            if (title.trim()) {
                const conference = await conferenceService.get(title)
                history.push("conference/" + conference.id)
            } else {
                setError("The conference title can not be empty.")
            }
        } catch (error) {
            console.log(error)
            console.log(error.response)
            setError(error.response.data.message)
        }
    }

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} animation={false}>
            <Modal.Header closeButton>
                Join a Conference
            </Modal.Header>
            <Form className="joinconvoform" onSubmit={(event) => handleSubmit(event)}>
                <Modal.Body>
                    {error && <Alert className="alert alert-danger">{error}</Alert>}
                    <Form.Group>
                        <Form.Control
                            value={title}
                            type="text"
                            placeholder="Title of the Conference"
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Join</Button>
                </Modal.Footer>
            </Form>
        </Modal >
    )
}

export default JoinConferenceForm
