import React from "react"
import { Link } from "react-router-dom"

import "./ListConvoButton.css"

const ListConvoButton = () => {
    return (
        <Link to="/list" className="list-button">
            <button style={{border:"0px", background:"transparent"}}>
                Browse All Conversations
            </button>
        </Link>
    )
}

export default ListConvoButton
