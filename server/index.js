const mongoose = require('mongoose')
const http = require('http')
const app = require('./app')
const config = require('./config')
const Conversation = require('./models/conversation')

mongoose
    .connect(config.dbUrl)
    .then(() => {
        console.log("connected to database")
    })
    .catch((err) => {
        console.log("couldn't connect to database")
    })

const server = http.createServer(app)
const io = require("socket.io")(server, { origins: "*:*" })

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

// socket.io code needs to be moved

const idNameMap = {} =

    io.on("connection", (socket) => {
        console.log("connected socket:", socket.request.connection.remoteAddress)
        socket.on("JOIN_ROOM", async (id) => {
            try {
                const conversation = await Conversation.findById(id)
                if (conversation != null) {
                    socket.join("room:" + id, () => {
                        console.log("Socket: " + socket.request.connection.remoteAddress + " joined room:" + id)
                    })
                    return socket.local.emit("SET_CONVERSATION", conversation)
                } else {
                    console.log("Socket: " + socket.request.connection.remoteAddress + " unsuccessfully tried to join room:" + id)
                    return socket.local.emit("SET_ERROR", "No conversation with this id found")
                }
            } catch (error) {
                console.log("error: ", error)
                socket.local.emit("SET_ERROR", "Server error: " + error)
            }
        })
        socket.on("LEAVE_ROOM", (id) => {
            socket.leave("room:" + id, () => {
                console.log("Socket: " + socket.request.connection.remoteAddress + " left room:" + id)
            })
        })
        socket.on("POST_COMMENT", async (id, comment) => {
            try {
                console.log("Socket: " + socket.request.connection.remoteAddress + " posted comment: " + comment + " in room:" + id)
                const conversation = await Conversation.findOneAndUpdate({ _id: id }, { $push: { messages: comment } })
                io.in("room:" + id).emit("UPDATE_CONVERSATION", comment)
            } catch (error) {
                console.log("error: " + error)
                socket.local.emit("SET_ERROR", "Server error: " + error)
            }
        })
        socket.on('disconnect', function () {
            io.emit('user disconnected')
        })
        socket.on("JOIN_CONFERENCE", data => {
            socket.join("conference:" + data.conferenceId, () => console.log("Socket: " + socket.id + " joined conference:" + data.conferenceId))
            idNameMap[socket.id] = data.name
            const rooms = io.sockets.adapter.rooms["conference:" + data.conferenceId]
            const sockets = rooms ? rooms.sockets : undefined
            let users = sockets ? Object.keys(sockets).filter(user => user !== socket.id) : []
            users = users.map(id => {
                return (
                    {
                        id: id,
                        name: idNameMap[id]
                    }
                )
            })
            console.log("USERS", users)
            socket.local.emit("SET_USERS", users)
            socket.local.emit("SET_IDENTITY", socket.id)
            users.forEach(user => socket.to(user.id).emit("NEW_USER", { id: socket.id, name: data.name }))
        })
        socket.on('LEAVE_CONFERENCE', data => {
            socket.leave("conference:" + data.conferenceId, () => {
                console.log("SOCKET: " + socket.id + " HAS LEFT CONFERENCE " + data.conferenceId)
            })
            io.in("conference:" + data.conferenceId).emit("REMOVE_USER", socket.id)
        })
        socket.on("CALL", data => {
            console.log("CALL", data)
            socket.to(data.receiver).emit("CALL_MADE", data)
        })
        socket.on("ANSWER_CALL", data => {
            console.log("ANSWER_CALL", data)
            socket.to(data.receiver).emit("ANSWER_MADE", data)
        })
        socket.on("NEW_ICE", data => {
            console.log("NEW ICE", data)
            socket.to(data.receiver).emit("NEW_ICE", data)
        })
        socket.on("POST_CONFERENCE_COMMENT", async (id, comment) => {
            try {
                console.log("IN: " + id + "COMMENT" + comment)
                io.in("conference:" + id).emit("UPDATE_CONFERENCE", comment)
            } catch (error) {
                console.log("error: " + error)
                socket.local.emit("SET_ERROR", "Server error: " + error)
            }
        })
    })


