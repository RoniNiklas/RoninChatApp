import React, { useState } from 'react'
import Card from "react-bootstrap/Card"
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"

const CommentInput = ({ setError, id, socket, name }) => {
    const [comment, setComment] = useState("")

    const sendComment = (event) => {
        event.preventDefault()
        const trimmedComment = comment.trim()
        verifyComment(trimmedComment)
            ? acceptComment(trimmedComment)
            : rejectComment()
    }
    const verifyComment = (trimmedComment) => {
        return (trimmedComment)
    }
    const acceptComment = (trimmedComment) => {
        socket.emit("POST_CONFERENCE_COMMENT", id, { text: trimmedComment, name, date: Date.now() })
        setComment("")
        setError("")
    }

    const rejectComment = () => {
        setError("The comment can't be empty")
    }

    return (
        <Card>
            <Form onSubmit={(event) => sendComment(event)} className='conference-comment-form'>
                <Form.Group>
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
            </Form>
        </Card>
    )
}

export default CommentInput
