import React from "react"
import Carousel from "react-bootstrap/Carousel"
import Image from "react-bootstrap/Image"

const ConversationCarousel = ({ conversations }) => {
    return (
        <>
            <Carousel>
                {conversations.map(conversation => {
                    return (
                        <Carousel.Item key={conversation.id} style={{ textAlign: "center", width: "100%", height: "360px", background: "gray" }}>
                            <div>
                                <Image
                                    fluid
                                    style={{maxWidth: "100%", maxHeight: "100%" }}
                                    src={conversation.image}
                                    alt="First slide"
                                />
                            </div>
                            <Carousel.Caption>
                                <h3>{conversation.title}</h3>
                                <p>{conversation.description}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )
                })}
            </Carousel>
        </>
    )
}

export default ConversationCarousel