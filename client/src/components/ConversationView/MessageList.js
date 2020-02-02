import React from "react"
import SingleMessage from "./SingleMessage"

const MessageList = ({messages}) => {
    return (
        <>
            <div style={{ position: "sticky", padding: 10 }} >
                {messages.map(message => {
                    return (<SingleMessage message={message} />)
                })}
            </div>
        </>
    )
}

export default MessageList
