import axios from 'axios'

const baseUrl = "http://localhost:3001/api/concerts"

const getConcerts = async () =>{
    const response = await axios.get(baseUrl)
    return response.data
}

const getConcertById = async(id)=>{
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

export default {getConcerts, getConcertById}