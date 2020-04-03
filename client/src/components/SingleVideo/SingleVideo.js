import React, { useRef, useEffect, useState } from "react"
import Spinner from "react-bootstrap/Spinner"

import "./SingleVideo.css"

const SingleVideo = ({ socket, pc, sender, remote, className, changeFocus }) => {

    const remoteVideo = useRef()
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        console.log("REDRAWING WITH USER", remote.id)
        console.log(sender)
        const openConnection = async () => {
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log("NEW ICE TO USER", remote.id)
                    socket.emit("NEW_ICE", { receiver: remote.id, sender, candidate: event.candidate, })
                }
            }
            pc.ontrack = (event) => {
                if (remoteVideo.current) { remoteVideo.current.srcObject = event.streams[0] }
            }
            if (navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                pc.addStream(stream)
            } else {
                alert('Your browser does not support getUserMedia API')
            }
            const offer = await pc.createOffer()
            await pc.setLocalDescription(new RTCSessionDescription(offer))
            console.log("CALLING USER", remote.id)
            socket.emit("CALL", { receiver: remote.id, sender, localDescription: pc.localDescription })
            pc.onconnectionstatechange = (event) => {
                switch (pc.connectionState) {
                    case "connected":
                        setConnected(true)
                        break;
                    case "connecting":
                        setConnected(false)
                    case "disconnected":
                        setConnected(false)
                    case "failed":
                        setConnected(false)
                        // One or more transports has terminated unexpectedly or in an error
                        break;
                    case "closed":
                        setConnected(false)
                        // The connection has been closed
                        break;
                }
            }
        }
        openConnection()
        return () => {
            console.log("CLOSING PC", pc)
            console.log("BY USER", remote)
            pc.close()
        }
    }, [])

    return (
        <div>
            {connected
                ? <video onClick={(event) => changeFocus(event)} className={className} id={remote.id} ref={remoteVideo} autoPlay />
                : <Spinner animation="border" role="status" />
            }
        </div>

    )
}

export default SingleVideo
