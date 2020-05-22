import axios from "axios"
const baseUrl = "/api/conference"

const add = async (password) => {
    const response = await axios.post(`${baseUrl}/new`, {password})
    return response.data
}

const get = async (title) => {
    const response = await axios.get(`${baseUrl}/${title}`)
    return response.data
}

export default { add, get }