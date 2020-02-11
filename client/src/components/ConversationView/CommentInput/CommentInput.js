import React, { useState } from 'react'
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import InputGroup from "react-bootstrap/InputGroup"
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"

const CommentInput = ({ setError, goToLast, propsId, socket }) => {
    const [sender, setSender] = useState("")
    const [id] = useState(propsId)
    const [comment, setComment] = useState("")

    const sendComment = (event) => {
        event.preventDefault()
        const trimmedComment = comment.trim()
        const trimmedSender = sender.trim()
        verifyComment(trimmedComment, trimmedSender)
            ? acceptComment(trimmedComment, trimmedSender)
            : rejectComment()
    }
    const verifyComment = (trimmedComment, trimmedSender) => {
        return (trimmedComment && trimmedSender)
    }
    const acceptComment = (trimmedComment, trimmedSender) => {
        socket.emit("POST_COMMENT", id, { text: trimmedComment, name: trimmedSender, date: Date.now() })
        setComment("")
        setError("")
        goToLast()
    }

    const rejectComment = () => {
        setError("Neither the comment or the username can be empty")
    }

    return (
        <>
            <div className="row" >
                <div className="col" className="col" style={{ background: "white", position: "fixed", bottom: 0, width: "100%" }} >
                    <Card style={{ background: "white", padding: 10, position: "fixed", bottom: 0, left: 0, right: 0, width: "100%" }} >
                        <Form onSubmit={(event) => sendComment(event)} className='comment-form'>
                            <Form.Row >
                                <Form.Group as={Col} sm="3" style={{ marginLeft: "auto", marginRight: "auto" }} >
                                    <Form.Label>Your Name</Form.Label>
                                    <InputGroup >
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>@</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            value={sender}
                                            onChange={(event) => setSender(event.target.value)}
                                            required />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col} sm="8" style={{ marginLeft: "auto", marginRight: "auto" }} >
                                    <Form.Label>Your Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        type='text'
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        required 
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                sendComment(event)
                                            }
                                        }}
                                        />
                                    <Button type="submit">Send comment</Button>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default CommentInput
