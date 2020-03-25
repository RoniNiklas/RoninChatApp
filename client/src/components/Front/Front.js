import React from "react"
import JoinConvoButton from "../JoinConvoButton/JoinConvoButton"
import StartConvoButton from "../StartConvoButton/StartConvoButton"
import ListConvoButton from "../ListConvoButton/ListConvoButton"
import FrontCarousel from "../FrontCarousel/FrontCarousel"

import "./Front.css"

const Front = () => {
    return (
        <div>
            <FrontCarousel />
            <div className="front-wrapper">
                <h2>Get Started!</h2>
                <div className="button-wrapper">
                    <JoinConvoButton />
                    <StartConvoButton />
                    <ListConvoButton />
                </div>
            </div>
        </div>
    )
}

export default Front
