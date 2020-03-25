import React from "react"
import Carousel from "react-bootstrap/Carousel"

import "./FrontCarousel.css"

const FrontCarousel = () => {
    return (
        <Carousel
            className="carousel"
            interval={10000}
            pause="false">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                    alt="First slide"
                />

                <Carousel.Caption>
                    <h3>Bringing People Together</h3>
                    <p>Stay connected with your team in the office or at home </p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src='https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <h3> Easy and Fast Communication</h3>
                    <p> Enjoy collaboration without restrictions </p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                    alt="Third slide"
                />

                <Carousel.Caption>
                    <h3>Not Just For Professional Use</h3>
                    <p> Planning a night out or a weekend trip? Get connected fast and easy! </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}

export default FrontCarousel
