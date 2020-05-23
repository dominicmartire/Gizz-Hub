import React, {useState, useEffect} from 'react';
import './App.css';
import videoService from './services/videoService';

const Video = ({title, file}) => {
  console.log(file)
  return(
    <div>
      <video id="video" width="320" height="240" src={file} controls>
      </video>
    </div>
  )
}

const UploadFile = ({handleSubmit, fileChange, changeTitle}) =>{
  return(
    <div>
      <div>Upload new video</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <input type="text" onChange={changeTitle}/>
        </div>
        <div>
          <input type="file" name="file" accept=".mp4, .wav, .ogg, .ogv" onChange={fileChange}/>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

const VideoContainer = ({title, getVideo}) => {
  const [show, setShow] = useState(false)
  const [source, setSource] = useState('')
  getVideo(title).then(r=>setSource(r.source))
  return(
    <div>
      <div onClick={()=>setShow(!show)}>{title}</div>
      {show ? <Video title={title} file={source}/> : null}
    </div>
  )
}

const Error = ({errorMessage}) =>{
  return(
    <div>
      {errorMessage}
    </div>
  )
}

const App = () =>{
  const [videos, setVideos] = useState([])
  const [file, setFile] = useState(new Blob())
  const [errorState, setErrorState] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('')
  const [videoComponents, setVideoComponents] = useState([])

  useEffect(()=>{
    const retrieve = async () =>{
      const files = await videoService.getVideos()
      setVideos(files)
    }
    retrieve()
    document.title = "Gizz Hub"
  },[])

/*
  const renderVideos = () =>{
    const loadFiles = () =>{
      const loadedVideos = videos.map(async video => {
        const loadedFile = await videoService.getVideo(video.filename)
        return {
          filename: video.filename,
          source: loadedFile,
          id: video._id
        }
      })
      return new Promise((resolve, reject)=>{
        resolve(loadedVideos)
      })
    }
    const updateVideos = async () =>{
      const loadedVideos = await loadFiles()
      setVideoComponents(loadedVideos.map(v=>{
        return <Video title={v.filename} file={v.source} id={v.id}/>
      }))
      console.log(videoComponents)
    }
    updateVideos()
  }
*/

  const renderContainers = () =>{
    return videos.map(v => {
      return <VideoContainer title={v.filename} getVideo={videoService.getVideo} key={v._id}/>
    })
  }


  const submitFile = async (e) =>{
    e.preventDefault()
    if(file.size === 0){
      setErrorState(true)
      setErrorMessage("Please upload a file")
      setTimeout(()=>{
        setErrorState(false)
        setErrorMessage('')
      }, 5000)
    }
    else if(title.size === 0){
      setErrorState(true)
      setErrorMessage("File has no name")
      setTimeout(()=>{
        setErrorState(false)
        setErrorMessage('')
      }, 5000)
    }
    else{
      try{
        const formData = new FormData()
        formData.append("file", file, file.name)
        const result = await videoService.uploadVideo(formData)
        console.log(result)
      }
      catch(e){
        console.log(e)
      }
    }
  }

  const fileChange= (e) =>{
    e.preventDefault()
    const f = e.target.files[0]
    setFile(f)
  }

  const changeTitle = (e) => {
    e.preventDefault()
    setTitle(e.target.value)
    console.log(title)
  }

  return(
  <div>
    {errorState === true ? <Error errorMessage={errorMessage}/> : <div></div>}
    {renderContainers()}
    <UploadFile handleSubmit={submitFile} fileChange={fileChange} changeTitle={changeTitle}/>
  </div>)
}

export default App;
