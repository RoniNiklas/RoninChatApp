import React from "react"
import { Link } from "react-router-dom"

const JoinVideoChatButton = () => {
    return (

        <Link to="/video/" className="front-button">
            <button style={{border:"0px", background:"transparent", margin:"auto"}}>
                Join a Video Chat
            </button>
        </Link>
    )
}

export default JoinVideoChatButton
