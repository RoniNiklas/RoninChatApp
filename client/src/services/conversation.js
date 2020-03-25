const axios = require('axios')
const baseUrl = "/api/conversations"
const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const add = async (conversation) => {
    const response = await axios.post(baseUrl, conversation)
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(baseUrl + "/" + id)
    return response.data
}

const autocomplete = async (title, callback) => {
    const response = await axios.get(baseUrl + "/autocomplete/" + title)
    response.data.length > 0 && callback(response.data)
}

export default { getAll, add, getOne, autocomplete }