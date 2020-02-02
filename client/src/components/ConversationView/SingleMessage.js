import React from "react"
import Toast from "react-bootstrap/Toast"

const SingleMessage = ({ message }) => {
    const date = new Date(message.date)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    let minutes = date.getMinutes()
    minutes = minutes.toString().length === 1
        ? "0" + minutes.toString()
        : minutes
    return (
        <Toast style={{margin:"auto", marginTop:10}}>
            <Toast.Header closeButton={false}>
                <strong className="mr-auto">{message.name}</strong>
                <small>{hour + ":" + minutes + " " + day + "/" + month + "/" + year}</small>
            </Toast.Header>
            <Toast.Body>{message.text}</Toast.Body>
        </Toast>
    )
}

export default SingleMessage
