import React from "react"
import { nanoid } from "nanoid"
import { useHistory } from "react-router-dom"

const StartConferenceButton = () => {
    const history = useHistory()
    const handleNewConference = () => {
        history.push("/conference/" + nanoid())
    }

    return (
        <button
            className="start-button"
            onClick={() => handleNewConference()} >
            Start a New Conference
        </button>
    )
}

export default StartConferenceButton
