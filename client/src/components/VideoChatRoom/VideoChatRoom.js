import React, { useRef, useState, useEffect } from "react"
import openSocket from "socket.io-client"

const VideoChatRoom = () => {
    const localVideo = useRef(null)
    const remoteVideo = useRef(null)

    useEffect(() => {
        let openedSocket
        let pc
        const openConnection = async () => {
            openedSocket = openSocket((process.env.NODE_ENV === "production" ?
                "https://roninchatapp.herokuapp.com/" :
                "http://localhost:5000"))
            openedSocket.connect()
            pc = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] })
            pc.onicecandidate = (event) => {
                if (event.candidate != null) {
                    openedSocket.emit("NEW_ICE", event.candidate)
                }
            }
            pc.ontrack = (event) => {
                remoteVideo.current.srcObject = event.streams[0]
            }
            if (navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                pc.addStream(stream)
                localVideo.current.srcObject = stream
            } else {
                alert('Your browser does not support getUserMedia API')
            }
            const offer = await pc.createOffer()
            await pc.setLocalDescription(new RTCSessionDescription(offer))
            openedSocket.emit("CALL", pc.localDescription)
            openedSocket.on("CALL_MADE", async offer => {
                console.log("CALL_MADE", offer)
                await pc.setRemoteDescription(
                    new RTCSessionDescription(offer)
                );
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(new RTCSessionDescription(answer))
                openedSocket.emit("ANSWER_CALL", answer)
            })
            openedSocket.on("NEW_ICE", ice =>
                pc.addIceCandidate(new RTCIceCandidate(ice))
            )
            openedSocket.on("ANSWER_MADE", async answer => {
                await pc.setRemoteDescription(
                    new RTCSessionDescription(answer)
                )
            })
        }
        openConnection()
        return () => {
            openedSocket.disconnect()
        }

    }, [])

    return (
        <div>
            <video id="localVideo" ref={localVideo} autoPlay muted />
            <video id="remoteVideo" ref={remoteVideo} autoPlay />
        </div>

    )
}

export default VideoChatRoom
