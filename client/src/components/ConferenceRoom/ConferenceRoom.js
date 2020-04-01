import React, { useState, useEffect, useRef } from "react"
import openSocket from "socket.io-client"

import SingleVideo from "../SingleVideo/SingleVideo"

const ConferenceRoom = ({ id = 1 }) => {
    const [socket, setSocket] = useState()
    const [users, setUsers] = useState([])
    const localVideo = useRef()
    const usersRef = useRef([])
    usersRef.current = users
    useEffect(() => {
        let openedSocket
        const openConnection = async () => {
            openedSocket = openSocket((process.env.NODE_ENV === "production" ?
                "https://roninchatapp.herokuapp.com/" :
                "http://localhost:5000"))
            openedSocket.connect()
            openedSocket.emit("JOIN_CONFERENCE", id)
            openedSocket.on("SET_USERS", receivedUsers => {
                setUsers(receivedUsers)
                usersRef.current = receivedUsers
                console.log("SET", usersRef.current)
            })
            openedSocket.on("NEW_USER", receivedUser => {
                usersRef.current = usersRef.current.concat([receivedUser])
                setUsers(usersRef.current)
                console.log("NEW", usersRef.current)
            })
            openedSocket.on("REMOVE_USER", receivedUser => {
                usersRef.current = usersRef.current.filter(user => user !== receivedUser)
                setUsers(usersRef.current)
                console.log("REMOVE", usersRef.current)
            })
            setSocket(openedSocket)
            window.addEventListener("beforeunload", () => {
                openedSocket.emit("LEAVE_CONFERENCE", id)
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
                {users.map(user => <SingleVideo key={user} socket={socket} user={user} />)}
            </div>
            <div>
                <video className="localVideo" id="localVideo" ref={localVideo} autoPlay muted />
            </div>
        </div>
    )
}

export default ConferenceRoom
