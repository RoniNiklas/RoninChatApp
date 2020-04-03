import React, { useRef, useEffect } from "react"

import "./SingleVideo.css"

const SingleVideo = ({ socket, pc, sender, remote, className, changeFocus }) => {

    const remoteVideo = useRef()

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
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                let stream
                try {
                    console.log("Trying audio + userfacing camera")
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user" } })

                } catch (error) {
                    try {
                        console.log(error)
                        console.log("Trying just audio")
                        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                    } catch (error) {
                        try {
                            console.log(error)
                            console.log("Trying just video")
                            stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
                        } catch (error) {
                            console.log(error)
                            console.log("joining without usermedia")
                        }
                    }
                }
                stream && pc.addStream(stream)
            } else {
                alert('Your browser does not support getUserMedia API. Use the newest version of Chrome or Firefox instead.')
            }
            const offer = await pc.createOffer()
            await pc.setLocalDescription(new RTCSessionDescription(offer))
            console.log("CALLING USER", remote.id)
            socket.emit("CALL", { receiver: remote.id, sender, localDescription: pc.localDescription })
        }
        openConnection()
        return () => {
            console.log("CLOSING PC", pc)
            console.log("BY USER", remote)
            pc.close()
        }
    }, [])

    return (
        <div className="singlevideo-wrapper">
            <video onClick={() => changeFocus(remoteVideo.current.srcObject)} className={className} id={remote.id} ref={remoteVideo} autoPlay />
            {(remote.name && window.innerWidth > 640) && <div className="name-tag">{remote.name} </div>}
        </div>
    )
}

export default SingleVideo
