import React, { useState } from "react"
import StartConversationForm from "../StartConversationForm/StartConversationForm"

import "./StartConvoButton.css"

const StartConvoButton= () => {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <button
                className="start-button"
                onClick={() => setShowModal(!showModal)}>
                Start a New Conversation
            </button>
            {showModal && <StartConversationForm showModal={showModal} setShowModal={setShowModal} />}
        </>
    )
}

export default StartConvoButton
