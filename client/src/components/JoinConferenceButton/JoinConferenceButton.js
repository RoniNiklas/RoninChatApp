import React, { useState } from "react"

import JoinConferenceForm from "../JoinConferenceForm/JoinConferenceForm"

const JoinConvoButton = () => {

    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button
                className="front-button"
                onClick={() => setShowModal(!showModal)}>
                Join a Conference
            </button>
            {showModal && <JoinConferenceForm showModal={showModal} setShowModal={setShowModal} />}
        </>
    )
}

export default JoinConvoButton
