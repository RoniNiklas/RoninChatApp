import React, { useState, useEffect, useRef } from "react"
import openSocket from "socket.io-client"
import MicOff from '@material-ui/icons/MicOff'
import MicOn from '@material-ui/icons/Mic'
import VideoOn from '@material-ui/icons/Videocam'
import VideoOff from '@material-ui/icons/VideocamOff'

import SingleVideo from "../SingleVideo/SingleVideo"

import "./ConferenceRoom.css"

const ConferenceRoom = ({ id = 1 }) => {
    const [socket, setSocket] = useState()
    const [audio, setAudio] = useState(false)
    const [video, setVideo] = useState(false)
    const [remotes, setRemotes] = useState([])
    const localVideo = useRef()
    const focusedVideo = useRef()
    const remotesRef = useRef([])
    const [identity, setIdentity] = useState()
    const identityRef = useRef()
    useEffect(() => {
        let openedSocket
        const openConnection = async () => {
            const name = "Adam" + Math.random()
            openedSocket = openSocket((process.env.NODE_ENV === "production" ?
                "https://roninchatapp.herokuapp.com/" :
                "http://localhost:5000"))
            openedSocket.connect()
            openedSocket.emit("JOIN_CONFERENCE", { conferenceId: id, name })
            openedSocket.on("SET_IDENTITY", id => {
                setIdentity(id)
                identityRef.current = id
            })
            openedSocket.on("SET_USERS", receivedUsers => {
                remotesRef.current = receivedUsers.map(user => {
                    return (
                        {
                            name: user.name,
                            id: user.id,
                            pc: new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] }),
                            className: 'minimized'
                        }
                    )
                })
                setRemotes(remotesRef.current)
                console.log("SET", remotesRef.current)
            })
            openedSocket.on("NEW_USER", receivedUser => {
                remotesRef.current = remotesRef.current.concat([
                    {
                        name: receivedUser.name,
                        id: receivedUser.id,
                        pc: new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] }),
                        className: 'minimized'
                    }
                ])
                setRemotes(remotesRef.current)
                console.log("NEW", remotesRef.current)
            })
            openedSocket.on("REMOVE_USER", receivedUser => {
                remotesRef.current = remotesRef.current.filter(user => user.id !== receivedUser)
                setRemotes(remotesRef.current)
                console.log("AFTER REMOVAL", remotesRef.current)
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
                openedSocket.emit("LEAVE_CONFERENCE", { conferenceId: id })
                openedSocket.off()
                openedSocket.disconnect()
            })
        }

        openConnection()

        const openLocalMedia = async () => {

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                let stream
                try {
                    console.log("Trying audio + userfacing camera")
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user" } })
                    setAudio(true)
                    setVideo(true)
                } catch (error) {
                    try {
                        console.log(error)
                        console.log("Trying just audio")
                        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                        setAudio(true)
                    } catch (error) {
                        try {
                            console.log(error)
                            console.log("Trying just video")
                            stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
                            setVideo(true)
                        } catch (error) {
                            console.log(error)
                            console.log("joining without usermedia")
                        }
                    }
                }
                localVideo.current.srcObject = stream ? stream : undefined
            } else {
                alert('Your browser does not support getUserMedia API. Use the newest version of Chrome or Firefox instead.')
            }
        }

        openLocalMedia()

        return () => {
            openedSocket.emit("LEAVE_CONFERENCE", id)
            openedSocket.off()
            openedSocket.disconnect()
        }
    }, [id])

    const changeFocus = (videoSrcObject) => {
        console.log("CURRENT", focusedVideo.current)
        console.log("OLD VIDEOSRCOBJECT", focusedVideo.current.srcObject)
        console.log("PASSED VIDEOSRCOBJECT", videoSrcObject)
        focusedVideo.current.srcObject = videoSrcObject
        console.log("CURRENTSRCOBJECT,", focusedVideo.current.srcObject)
    }

    const loseFocus = () => {
        console.log("OLD VIDEOSRCOBJECT", focusedVideo.current.srcObject)
        focusedVideo.current.srcObject = undefined
        console.log("CURRENT VIDEOSRCOBJECT", focusedVideo.current.srcObject)
    }

    return (
        <div className="videos-wrapper">
            <div className="pointless-place-holder">
                <video onClick={() => loseFocus()} className="focused" id="focusedVideo" ref={focusedVideo} autoPlay />
            </div>
            <div className="minimized-wrapper">
                <div className="singlevideo-wrapper">
                    <video onClick={() => changeFocus(localVideo.current.srcObject)}className="localVideo" id="localVideo" ref={localVideo} autoPlay muted />
                    <div className="name-tag"> You {audio ? <MicOn /> : <MicOff />}
                    {video ? <VideoOn /> : <VideoOff />} </div>
                    
                </div>
                {(identity && remotes) && remotes.map(remote => <SingleVideo changeFocus={changeFocus} key={remote.id} socket={socket} remote={remote} sender={identity} pc={remote.pc} className={remote.className} />)}
            </div>
        </div>
    )
}

export default ConferenceRoom
