import React, { useState } from "react"
import StartConferenceForm from "../StartConferenceForm/StartConferenceForm"


const StartConferenceButton = () => {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <button
                className="start-button"
                onClick={() => setShowModal(!showModal)} >
                Start a New Conference
            </button>
            {showModal && <StartConferenceForm showModal={showModal} setShowModal={setShowModal} />}
        </>
    )
}

export default StartConferenceButton
