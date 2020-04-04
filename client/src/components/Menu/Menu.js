import React from "react"
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import "./Menu.css"

const Menu = () => {
    return (
        <Navbar className="menu" collapseOnSelect bg="light" expand="lg">
            <div className="menu-items">
                <Navbar.Brand as={Link} href='#' to='/'>Ronin ChatApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Link to="/user/">
                            <button>
                                Change your name
                            </button>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default Menu