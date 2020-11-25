import React from 'react'
import {useParams} from 'react-router-dom'
import Video from '../components/video'
import videoService from '../services/videoService'

const Concert = ({concerts, videos, changeConcertId, children})=>{

    const id = useParams().id
    const concert = concerts.find(c=>c.id === id)
  
    if(typeof concert === 'undefined'){
      return(
        <div>
          {children}
        </div>
      )
    }
    const videoComponents = concert.videos.map(videoId=>{
      const videoObject = videos.find(v=>v.id === videoId)
      if(typeof videoObject !== 'undefined'){
        const title = videoObject.title
        return <Video key={videoId} title={title} url={videoService.videoUrl(videoId)}/>
      }
    })
    changeConcertId(id)
    return(
      <div>
        <h2>
          {concert.location}
        </h2>
        <div>
          {videoComponents}
        </div>
        {children}
      </div>
    )
  }

export default Concert