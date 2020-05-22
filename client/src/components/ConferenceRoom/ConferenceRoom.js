import React, { useState, useEffect, useRef } from "react"
import openSocket from "socket.io-client"
import Alert from "react-bootstrap/Alert"
import MicOff from '@material-ui/icons/MicOff'
import MicOn from '@material-ui/icons/Mic'
import VideoOn from '@material-ui/icons/Videocam'
import VideoOff from '@material-ui/icons/VideocamOff'
import ArrowUp from '@material-ui/icons/KeyboardArrowUp'
import ArrowDown from "@material-ui/icons/KeyboardArrowDown"

import SingleVideo from "../SingleVideo/SingleVideo"
import ConferenceChat from "../ConferenceChat/ConferenceChat"

import "./ConferenceRoom.css"

const ConferenceRoom = ({ id, name, devices, password, setName, setPassword }) => {
    const [error, setError] = useState("")
    const [socket, setSocket] = useState()
    const [audio, setAudio] = useState(devices.chosen.audio)
    const [video, setVideo] = useState(devices.chosen.video)
    const [remotes, setRemotes] = useState([])
    const localVideo = useRef()
    const focusedVideo = useRef()
    const remotesRef = useRef([])
    const videosRef = useRef()
    const [stream, setStream] = useState(new MediaStream())
    const [identity, setIdentity] = useState()
    console.log("room draws")
    useEffect(() => {
        let openedSocket
        const openConnection = async () => {
            openedSocket = openSocket((process.env.NODE_ENV === "production" ?
                "https://roninchatapp.herokuapp.com/" :
                "http://localhost:5000"))
            openedSocket.connect()
            openedSocket.emit("JOIN_CONFERENCE", { conferenceId: id, name, password })
            openedSocket.on("SET_IDENTITY", id => {
                setIdentity(id)
            })
            openedSocket.on("SET_ERROR", error => {
                setError(error)
            })
            openedSocket.on("SET_USERS", receivedUsers => {
                remotesRef.current = receivedUsers.map(user => {
                    return (
                        {
                            name: user.name,
                            id: user.id,
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
                        name: receivedUser.name,
                        id: receivedUser.id,
                        pc: new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] })
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
                if (data.localDescription) {
                    const pc = user.pc
                    await pc.setRemoteDescription(
                        new RTCSessionDescription(data.localDescription)
                    );
                    const answer = await pc.createAnswer()
                    await pc.setLocalDescription(new RTCSessionDescription(answer))
                    console.log("ANSWERING CALL FROM USER", user)
                    openedSocket.emit("ANSWER_CALL", { receiver: data.sender, sender: data.receiver, answer: answer })
                }         
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
                let newStream
                try {
                    console.log("Trying audio + userfacing camera")
                    newStream = await navigator.mediaDevices.getUserMedia({ audio: devices.chosen.audio, video: devices.chosen.video ? { facingMode: "user" } : false })
                } catch (error) {
                    console.log("error in localvideo stream")
                    console.log(error)
                }
                await new Promise((resolve, reject) => {
                    localVideo.current && resolve()
                })
                localVideo.current.srcObject = newStream
                setStream(newStream)
            } else {
                alert('Your browser does not support getUserMedia API. Use the newest version of Chrome or Firefox instead.')
            }
        }

        openLocalMedia()

        return () => {
            openedSocket.emit("LEAVE_CONFERENCE", { conferenceId: id })
            openedSocket.off()
            openedSocket.disconnect()
            setName("")
            setPassword("")
        }
    }, [id, name, devices, password, setName, setPassword])

    const changeFocus = (videoSrcObject) => {
        focusedVideo.current.srcObject = videoSrcObject
    }

    const loseFocus = () => {
        focusedVideo.current.srcObject = undefined
    }

    const screenCapture = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia()
            const screenVideo = screenStream.getVideoTracks()[0]
            const oldVideo = stream.getVideoTracks()[0]
            const streamCopy = new MediaStream()
            stream.getAudioTracks()[0] && streamCopy.addTrack(stream.getAudioTracks()[0])
            streamCopy.addTrack(screenVideo) 
            setStream(streamCopy)
            localVideo.current.srcObject = streamCopy
            screenVideo.addEventListener('ended', () => {
                console.log("DO SOMETHING")
                const streamCopy = new MediaStream()
                stream.getAudioTracks()[0] && streamCopy.addTrack(stream.getAudioTracks()[0])
                stream.getVideoTracks()[0] && streamCopy.addTrack(oldVideo)
                setStream(streamCopy)
                localVideo.current.srcObject = streamCopy
            })
        } catch (err) {
            console.log("Error: " + err)
        }
    }

    const goTo = (pos) => {
        videosRef.current.scrollTop = (pos === "bottom")
            ? videosRef.current.scrollHeight
            : 0
    }
    const alterAudioState = () => {
        if (devices.available.audio) {
            stream.getAudioTracks().forEach(track => track.enabled = !track.enabled)
            setAudio(!audio)
        }
    }

    const alterVideoState = () => {
        if (devices.available.video) {
            stream.getVideoTracks().forEach(track => track.enabled = !track.enabled)
            setVideo(!video)
        }
    }
    return (
        <div className="conference-wrapper">
            {error && <Alert variant="danger" className="conference-error">{error}</Alert>}
            {identity &&
                <div className="videos-wrapper">
                    <div className="pointless-place-holder">
                        <video onClick={() => loseFocus()} className="focused" id="focusedVideo" ref={focusedVideo} autoPlay muted />
                    </div>
                    <div className="relative" >
                        <div className="minimized-wrapper" ref={videosRef}>
                            <div className="singlevideo-wrapper">
                                <video onClick={() => changeFocus(localVideo.current.srcObject)} className="localVideo" id="localVideo" ref={localVideo} autoPlay muted />
                                <div className="name-tag">
                                    You &nbsp;
                                    <button onClick={alterAudioState}>{audio ? <MicOn /> : <MicOff />}</button>
                                    <button onClick={alterVideoState}>{video ? <VideoOn /> : <VideoOff />}</button>
                                    <button onClick={screenCapture}>Share screen</button>
                                </div>
                            </div>
                            <button className="absolute top right popped arrow-button" onClick={() => goTo("top")}>
                                <ArrowUp />
                            </button>
                            {(remotes && stream) && remotes.map(remote => <SingleVideo changeFocus={changeFocus} key={remote.id} socket={socket} remote={remote} sender={identity} stream={stream} />)}
                            <button className="absolute bottom right popped arrow-button" onClick={() => goTo("bottom")}>
                                <ArrowDown />
                            </button>
                        </div>
                    </div>
                </div>
            }
            {(identity && socket && name) && <ConferenceChat socket={socket} id={id} name={name} />}
        </div>
    )
}

export default ConferenceRoom
