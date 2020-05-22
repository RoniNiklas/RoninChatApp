import React from "react"
import { Link } from "react-router-dom"

const ListConvoButton = () => {
    return (
        <button className="front-button">
            <Link to="/list">
                Browse All Conversations
            </Link>
        </button>

    )
}

export default ListConvoButton
