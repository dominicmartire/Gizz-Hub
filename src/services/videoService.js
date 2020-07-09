import axios from 'axios'

const baseUrl = "http://localhost:3001/api/videos/"

const getVideos = async () => {
    const response = await axios.get(`${baseUrl}`)
    return response.data
}

const videoUrl = (id) =>{
    return `${baseUrl}${id}`
}

const uploadVideo = async (video) =>{
    const result = await axios.post(`${baseUrl}`, video)
    return result.data
}



export default {getVideos, uploadVideo, videoUrl}