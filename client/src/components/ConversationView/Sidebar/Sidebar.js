import React from "react"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import "./Sidebar.css"
const Sidebar = ({ conversation, goToTop, goToLast, width }) => {
    return (
        <>
            <Card
                className="card bg-light text-dark sidebar-item"
                style={{
                    position: (width > 720) ? "sticky" : "static",
                    left: "1em",
                    top: "6em",
                    width: (width > 720) ? "360px" : 0.9*width+"px",
                    margin: "1em",
                    height: "100%"
                }}
            >
                <Card.Img src={conversation.image} className="sidebar-image" alt="Card image" />
                <Card.Header className="sidebar-header">{conversation.title}</Card.Header>
                <Card.Text className="sidebar-description">{conversation.description}</Card.Text>
                <Button variant="outline-primary" onClick={goToTop}>Go to top</Button>
                <Button variant="outline-primary" onClick={goToLast}>Go to the newest message</Button>
            </Card>
        </>
    )
}

export default Sidebar
