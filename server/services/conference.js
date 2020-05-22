const { nanoid } = require("nanoid")

const conferences = {}

const add = (password) => {
    let id = nanoid()
    while (conferences[id] !== undefined) {
        id = nanoid()
    }
    conferences[id] = { id, password }
    return conferences[id]
}

const get = (id) => {
    return conferences[id]
}

const verify = (id, givenPassword) => {
    return conferences[id].password === givenPassword
}

module.exports = {
    add,
    verify,
    get
}