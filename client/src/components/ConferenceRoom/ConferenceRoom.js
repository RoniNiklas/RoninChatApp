import React, { useState, useEffect, useRef } from "react"
import openSocket from "socket.io-client"

import SingleVideo from "../SingleVideo/SingleVideo"

const ConferenceRoom = ({ id = 1 }) => {
    const [socket, setSocket] = useState()
    const [remotes, setRemotes] = useState([])
    const localVideo = useRef()
    const remotesRef = useRef([])
    const [identity, setIdentity] = useState()
    const identityRef = useRef()
    useEffect(() => {
        let openedSocket
        const openConnection = async () => {
            openedSocket = openSocket((process.env.NODE_ENV === "production" ?
                "https://roninchatapp.herokuapp.com/" :
                "http://localhost:5000"))
            openedSocket.connect()
            openedSocket.emit("JOIN_CONFERENCE", id)
            openedSocket.on("SET_IDENTITY", id => {
                setIdentity(id)
                identityRef.current = id
            })
            openedSocket.on("SET_USERS", receivedUsers => {
                remotesRef.current = receivedUsers.map(id => {
                    return (
                        {
                            id: id,
                            pc: new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] })
                        }
                    )
                })
                setRemotes(remotesRef.current)
                console.log("SET", remotesRef.current)
            })
            openedSocket.on("NEW_USER", receivedUser => {
                remotesRef.current = remotesRef.current.concat([
                    {
                        id: receivedUser,
                        pc: new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] })
                    }
                ])
                setRemotes(remotesRef.current)
                console.log("NEW", remotesRef.current)
            })
            openedSocket.on("REMOVE_USER", receivedUser => {
                remotesRef.current = remotesRef.current.filter(user => user.id !== receivedUser)
                setRemotes(remotesRef.current)
                console.log("REMOVE", remotesRef.current)
            })
            openedSocket.on("CALL_MADE", async data => {
                const user = remotesRef.current.filter(user => user.id === data.sender)[0]
                const pc = user.pc
                await pc.setRemoteDescription(
                    new RTCSessionDescription(data.localDescription)
                );
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(new RTCSessionDescription(answer))
                console.log("ANSWERING CALL FROM USER", user)
                openedSocket.emit("ANSWER_CALL", { receiver: data.sender, sender: data.receiver, answer: answer })
            })
            openedSocket.on("NEW_ICE", data => {
                const user = remotesRef.current.filter(user => user.id === data.sender)[0]
                console.log("NEW ICE FROM USER", user)
                const pc = user.pc
                pc.addIceCandidate(new RTCIceCandidate(data.candidate))
            })
            openedSocket.on("ANSWER_MADE", async data => {
                const user = remotesRef.current.filter(user => user.id === data.sender)[0]
                console.log("ANSWERED USER", user)
                const pc = user.pc
                await pc.setRemoteDescription(
                    new RTCSessionDescription(data.answer)
                )

            })
            setSocket(openedSocket)
            window.addEventListener("beforeunload", () => {
                openedSocket.emit("LEAVE_CONFERENCE", id)
                openedSocket.off()
                openedSocket.disconnect()
            })
        }

        openConnection()

        const openLocalMedia = async () => {
            if (navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                localVideo.current.srcObject = stream
            } else {
                alert('Your browser does not support getUserMedia API')
            }
        }

        openLocalMedia()

        return () => {
            openedSocket.emit("LEAVE_CONFERENCE", id)
            openedSocket.off()
            openedSocket.disconnect()
        }
    }, [id])

    return (
        <div>
            <div>
                {(identity && remotes) && remotes.map(remote => <SingleVideo key={remote.id} socket={socket} remote={remote} sender={identity} pc={remote.pc} />)}
            </div>
            <div>
                <video className="localVideo" id="localVideo" ref={localVideo} autoPlay muted />
            </div>
        </div>
    )
}

export default ConferenceRoom
