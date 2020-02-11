import React from "react"
import SingleMessage from "./SingleMessage/SingleMessage"
import "./MessageList.css"
const MessageList = ({ messages, width }) => {
    return (
        <>
            {messages.map((message, index) => {
                return (<SingleMessage key={index} message={message} width={width} />)
            })}
        </>
    )
}

export default MessageList
