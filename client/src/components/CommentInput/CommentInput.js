import React, { useState, useRef, useEffect } from 'react'
import Card from "react-bootstrap/Card"
import Form from 'react-bootstrap/Form'
import InsertEmoticon from '@material-ui/icons/InsertEmoticon'
import { Picker } from "emoji-mart"

import 'emoji-mart/css/emoji-mart.css'

const CommentInput = ({ setError, id, socket, name }) => {
    const [comment, setComment] = useState("")
    const [showPicker, setShowPicker] = useState(false)
    const pickerRef = useRef()

    useEffect(() => {
        const hidePicker = (event) => {
            const path = event.path || (event.composedPath && event.composedPath());
            const mart = path.map(node => node.className).filter(className => className && (typeof (className) === "string") && className.includes("emoji-mart"));
            (mart.length === 0 && pickerRef.current !== null) && setShowPicker(false)
        }
        showPicker && document.addEventListener("click", hidePicker)
        return () => document.removeEventListener("click", hidePicker)
    }, [showPicker])

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

    const handlePickerClick = (event) => {
        event.preventDefault()
        setShowPicker(!showPicker)
    }

    const selectEmoji = (emoji) => {
        console.log(emoji)
        setComment(comment + emoji.native)
        setShowPicker(false)
    }

    return (
        <Card className="comment-box">
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
                    <div className="conference-comment-form-button-toolbar">
                        <button className="select-emoticon-button" onClick={handlePickerClick}>
                            <InsertEmoticon />
                        </button>
                        <button className="send-comment-button" type="submit">Send comment</button>
                    </div>
                    {showPicker && <Picker ref={pickerRef} onSelect={selectEmoji} />}
                </Form.Group>
            </Form>
        </Card>
    )
}

export default CommentInput
