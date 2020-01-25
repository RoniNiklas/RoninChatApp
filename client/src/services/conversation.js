const axios = require('axios')
const baseUrl = "/api/conversations"
const getAll = async () => {
    console.log(baseUrl)
    const response = await axios.get(baseUrl)
    console.log(response)
    return response.data
}

const add = async (conversation) => {
    console.log(conversation)
    const response = await axios.post(baseUrl, conversation)
    console.log(response.data)
    return response.data
}

const getOne = async (id) => {
    console.log(id)
    const response = await axios.get(baseUrl + "/" + id)
    console.log (response.data)
    return response.data
}

export default { getAll, add, getOne }