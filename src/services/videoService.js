import axios from 'axios'

const baseUrl = "http://localhost:3001/api/videos"

const getVideos = async () => {
    const response = await axios.get(`${baseUrl}`)
    return response.data
}

const getVideo = async (id) =>{
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

const uploadVideo = async (video) =>{
    const result = await axios.post(`${baseUrl}`, video)
    return result.data
}

export default {getVideos, uploadVideo, getVideo}