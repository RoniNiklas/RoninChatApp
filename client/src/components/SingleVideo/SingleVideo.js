import React, { useRef, useState, useEffect } from "react"

import "./SingleVideo.css"

const VideoChatRoom = ({ socket, user }) => {
    const remoteVideo = useRef()

    useEffect(() => {
        let pc
        console.log("REDRAWING WITH USER", user)
        const openConnection = async () => {
            pc = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] })
            pc.onicecandidate = (event) => {
                if (event.candidate != null) {
                    console.log("NEW ICE TO USER", user)
                    socket.emit("NEW_ICE", { user: user, candidate: event.candidate })
                }
            }
            pc.ontrack = (event) => {
                remoteVideo.current.srcObject = event.streams[0]
            }
            if (navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                pc.addStream(stream)
            } else {
                alert('Your browser does not support getUserMedia API')
            }
            const offer = await pc.createOffer()
            await pc.setLocalDescription(new RTCSessionDescription(offer))
            console.log("CALLING USER", user)
            socket.emit("CALL", { user: user, localDescription: pc.localDescription })
            socket.on("CALL_MADE", async offer => {
                await pc.setRemoteDescription(
                    new RTCSessionDescription(offer)
                );
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(new RTCSessionDescription(answer))
                console.log("ANSWERING CALL FROM USER", user)
                socket.emit("ANSWER_CALL", { user: user, answer: answer })
            })
            socket.on("NEW_ICE", ice => {
                pc.addIceCandidate(new RTCIceCandidate(ice))
            })
            socket.on("ANSWER_MADE", async answer => {
                await pc.setRemoteDescription(
                    new RTCSessionDescription(answer)
                )
            })
        }
        openConnection()
        window.addEventListener("beforeunload", () => {
            ["NEW_ICE", "CALL_MADE", "ANSWER_MADE"].forEach(listener => socket.removeEventListener(listener));
        })
        return () => {
            ["NEW_ICE", "CALL_MADE", "ANSWER_MADE"].forEach(listener => socket.removeEventListener(listener));
        }
    }, [user])

    return (
        <div>
            <video className="remoteVideo" id="remoteVideo" ref={remoteVideo} autoPlay />
        </div>

    )
}

export default VideoChatRoom
