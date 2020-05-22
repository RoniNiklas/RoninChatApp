import React from "react"
import { Link } from "react-router-dom"

import "./JoinVideoChatButton.css"

const JoinVideoChatButton = () => {
    return (

        <Link to="/video/" className="video-button">
            <button style={{border:"0px", background:"transparent", margin:"auto"}}>
                Join a Video Chat
            </button>
        </Link>
    )
}

export default JoinVideoChatButton
