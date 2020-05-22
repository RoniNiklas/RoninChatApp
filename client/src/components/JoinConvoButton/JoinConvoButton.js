import React, { useState } from "react"

import JoinConvoForm from "../JoinConvoForm/JoinConvoForm"

const JoinConvoButton = () => {

    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button
                className="front-button"
                onClick={() => setShowModal(!showModal)}>
                Join a Conversation
            </button>
            {showModal && <JoinConvoForm showModal={showModal} setShowModal={setShowModal} />}
        </>
    )
}

export default JoinConvoButton
