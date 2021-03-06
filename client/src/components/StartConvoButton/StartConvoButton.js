import React, { useState } from "react"
import StartConversationForm from "../StartConversationForm/StartConversationForm"

const StartConvoButton= () => {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <button
                className="front-button"
                onClick={() => setShowModal(!showModal)}>
                Start a New Conversation
            </button>
            {showModal && <StartConversationForm showModal={showModal} setShowModal={setShowModal} />}
        </>
    )
}

export default StartConvoButton
