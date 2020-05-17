import axios from 'axios'

const baseUrl = "http://localhost:3001"

const getVideos = async () => {
    const response = await axios.get(`${baseUrl}/videos`)
    return response.data
}

const uploadVideo = async (video) =>{
    await axios.post(`${baseUrl}/videos`, video)
}

export default {getVideos, uploadVideo}