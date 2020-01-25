const mongoose = require('mongoose')
const http = require('http')
const app = require('./app')
const config = require('./config')

mongoose
    .connect(config.dbUrl)
    .then(() => {
        console.log("connected to database", config.dbUrl)
    })
    .catch((err) => {
        console.log(err)
    })

const server = http.createServer(app)
const io = require("socket.io")(server, { origins: "*:*" })

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})


