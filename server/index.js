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
    socket.on("JOIN_CONFERENCE", id => {
        socket.join("conference:"+id, () => console.log("Socket: " + socket.id+ " joined conference:" + id))
        const rooms = io.sockets.adapter.rooms["conference:"+id]
        const sockets = rooms ? rooms.sockets : undefined
        const users = sockets ? Object.keys(sockets).filter(user => user !== socket.id) : []
        console.log("USERS", users)
        socket.local.emit("SET_USERS", users)
        users.forEach(user => socket.to(user).emit("NEW_USER", socket.id))
    })
    socket.on('LEAVE_CONFERENCE', id => {
        socket.leave("conference:"+id, () => {
            console.log("SOCKET: " + socket.id + " HAS LEFT CONFERENCE "+ id)
        })
        io.in("conference:"+id).emit("REMOVE_USER", socket.id)
    })
    socket.on("CALL", offer => {
        socket.to(offer.user).emit("CALL_MADE", offer.localDescription)
    })
    socket.on("ANSWER_CALL", answer => {
        socket.to(answer.user).emit("ANSWER_MADE", answer.answer)
    })
    socket.on("NEW_ICE", data => {
        socket.to(data.user).emit("NEW_ICE", data.candidate)
    })
})


