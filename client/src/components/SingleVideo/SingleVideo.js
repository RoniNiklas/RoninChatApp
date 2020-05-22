import React, { useRef, useEffect } from "react"

import "./SingleVideo.css"

const SingleVideo = ({ socket, sender, remote, changeFocus, stream }) => {

    const remoteVideo = useRef()
    const inboundStream = useRef()
    console.log("SINGLE VIDEO DRAWS WITH USER", remote.name)
    useEffect(() => {
        console.log("NEW USE EFFECT WITH USER", remote.id)
        console.log("SENDER", sender)
        const openConnection = async () => {
            remote.pc = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] })
            remote.pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log("NEW ICE TO USER", remote.id)
                    socket.emit("NEW_ICE", { receiver: remote.id, sender, candidate: event.candidate, })
                }
            }
            /*
            remote.pc.ontrack = (event) => {
                if (remoteVideo.current) { remoteVideo.current.srcObject = event.streams[0] }
            }*/
            remote.pc.ontrack = event => {
                console.log("NEW TRACK", event.track)
                if (event.streams && event.streams[0]) {
                    remoteVideo.current.srcObject = event.streams[0]
                } else {
                    if (!inboundStream.current) {
                        inboundStream.current = new MediaStream()
                        remoteVideo.current.srcObject = inboundStream.current
                    }
                    inboundStream.current.addTrack(event.track)
                }
            }
            console.log("SENDING TRACKS", stream.getTracks())
            stream.getTracks().forEach(track => remote.pc.addTrack(track, stream));
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
    }, [stream])

    return (
        <div className="singlevideo-wrapper">
            <video onClick={() => changeFocus(remoteVideo.current.srcObject)} className="minimized" id={remote.id} ref={remoteVideo} autoPlay />
            {(remote.name && window.innerWidth > 640) && <div className="name-tag">{remote.name} </div>}
        </div>
    )
}

export default SingleVideo
