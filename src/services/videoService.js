import axios from 'axios'

const baseUrl = "http://localhost:3001"

const getVideos = async () => {
    const response = await axios.get(`${baseUrl}/videos`)
    return response.data
}

const getVideo = async (filename) =>{
    const response = await axios.get(`${baseUrl}/videos/${filename}`)
    return response.data
}

const uploadVideo = async (video) =>{
    const result = await axios.post(`${baseUrl}/videos`, video)
    return result.data
}

export default {getVideos, uploadVideo, getVideo}