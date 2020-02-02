import React, { useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import Form from "react-bootstrap/Form"
import conversationService from '../../services/conversation'
import { useHistory } from 'react-router-dom'
import Spinner from '../Spinner'

const NewConversationForm = () => {
    const [show, setShow] = useState(true)
    const [error, setError] = useState("")
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState()
    const [image, setImage] = useState()
    const [description, setDescription] = useState("")
    const history = useHistory()

    const postConversation = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (title && description && image) {
            const conversation = {}
            conversation.title = title
            conversation.description = description
            conversation.image = imagePreview
            const savedConversation = await conversationService.add(conversation)
            history.push("/conversations/" + savedConversation.id)
        } else {
            setLoading(false)
            setError("The conversation needs a title, a description and an image.")
        }
    }

    const handleClose = () => {
        setShow(false)
        history.goBack()
    }

    const getUploadedFile = async (event) => {
        setImagePreview()
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            verifyImage(reader.result, file, (accepted, reason) => {
                accepted
                    ? acceptFile(file, reader.result)
                    : rejectFile(reason)
            })
        }
        reader.readAsDataURL(file)
    }

    const acceptFile = (file, fileUrl) => {
        setImage(file)
        console.log("Accepted File", file)
        setImagePreview(fileUrl)
        setError()
    }

    const rejectFile = (reason) => {
        setImage()
        setImagePreview()
        setError(reason)
    }

    const verifyImage = (url, file, callback) => {
        let img = new Image();
        img.onload = () => {
            file.size < 5242880
                ? callback(true, "")
                : callback(false, "File is too large.")
        }
        img.onerror = () => callback(false, "File is not an image.")
        img.src = url;
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new conversation</Modal.Title>
                </Modal.Header>
                {loading ?
                    <><Spinner /></>
                    :
                    <>
                        <Modal.Body>
                            {error && <Alert className="alert alert-danger">{error}</Alert>}
                            <div className="postForm">
                                <Form onSubmit={postConversation}>
                                    <Form.Group>
                                        <Form.Label htmlFor="title">Title for the Conversation: </Form.Label>
                                        <Form.Control type="text" name="title" onChange={e => setTitle(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor="description">Description of the Conversation: </Form.Label>
                                        <Form.Control type="text" name="title" onChange={e => setDescription(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor="image">Image for the Conversation: </Form.Label>
                                        <Form.Control type="file" name="image" accept="image/*" onChange={getUploadedFile} />
                                        <Form.Text> Image size limit is 5mb </Form.Text>
                                    </Form.Group>
                                </Form>
                            </div>
                            {imagePreview && <div style={{ textAlign: "center" }}> Preview: <div><img src={imagePreview} style={{ maxHeight: "300px" }} alt="Preview goes here" /></div></div>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={postConversation}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </>
                }
            </Modal >
        </>
    )
}

export default NewConversationForm