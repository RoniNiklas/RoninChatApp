import React, { useState } from "react"

import JoinConvoForm from "../JoinConvoForm/JoinConvoForm"

import "./JoinConvoButton.css"

const JoinConvoButton = () => {

    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button
                className="join-button"
                onClick={() => setShowModal(!showModal)}>
                Join a Conversation
            </button>
            {showModal && <JoinConvoForm showModal={showModal} setShowModal={setShowModal} />}
        </>
    )
}

export default JoinConvoButton
