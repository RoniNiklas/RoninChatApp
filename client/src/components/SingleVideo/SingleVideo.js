import React, { useRef, useEffect } from "react"

import "./SingleVideo.css"

const SingleVideo = ({ socket, devices, sender, remote, changeFocus }) => {

    const remoteVideo = useRef()

    useEffect(() => {
        console.log("REDRAWING WITH USER", remote.id)
        console.log("SENDER", sender)
        const openConnection = async () => {
            remote.pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log("NEW ICE TO USER", remote.id)
                    socket.emit("NEW_ICE", { receiver: remote.id, sender, candidate: event.candidate, })
                }
            }
            remote.pc.ontrack = (event) => {
                if (remoteVideo.current) { remoteVideo.current.srcObject = event.streams[0] }
            }
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                let stream
                try {
                    console.log("Trying audio + userfacing camera")
                    stream = await navigator.mediaDevices.getUserMedia({ audio: devices.audio, video: devices.video ? { facingMode: "user" } : false })
                } catch (error) {
                    console.log("error in remotevideo stream")
                    console.log(error)
                }
                stream && remote.pc.addStream(stream)
            } else {
                alert('Your browser does not support getUserMedia API. Use the newest version of Chrome or Firefox instead.')
            }
            const offer = await remote.pc.createOffer()
            await remote.pc.setLocalDescription(new RTCSessionDescription(offer))
            console.log("CALLING USER", remote.id)
            socket.emit("CALL", { receiver: remote.id, sender, localDescription: remote.pc.localDescription })
        }
        openConnection()
        return () => {
            console.log("CLOSING PC", remote.pc)
            console.log("BY USER", remote)
            remote.pc.close()
        }
    }, [])

    return (
        <div className="singlevideo-wrapper">
            <video onClick={() => changeFocus(remoteVideo.current.srcObject)} className="minimized" id={remote.id} ref={remoteVideo} autoPlay />
            {(remote.name && window.innerWidth > 640) && <div className="name-tag">{remote.name} </div>}
        </div>
    )
}

export default SingleVideo
