import Spinner from 'react-bootstrap/Spinner'
import React from 'react'

const SpinnerToExport = () => {
    return (
        <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
    )
}

export default SpinnerToExport