import React from "react"
import SingleMessage from "./SingleMessage"

const MessageList = ({messages}) => {
    return (
        <>
            <div style={{ position: "sticky", padding: 10 }} >
                {messages.map((message, index) => {
                    return (<SingleMessage key={index}message={message} />)
                })}
            </div>
        </>
    )
}

export default MessageList
