import React, {useState, useEffect} from 'react';
import './App.css';
import videoService from './services/videoService';


const Video = ({title, file}) => {
  const [show, setShow] = useState(false)
  return(
    <div>
      <h2  onClick={()=>setShow(!show)}>{title}</h2>
      {show ? <video id="video" width="320" height="240" src={file} controls>
      </video> : null}
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
  const [videoContainers, setVideoContainers] = useState([])

  useEffect(()=>{
    videoService.getVideos().then(response=>setVideos(response))
    document.title = "Gizz Hub"
    //videoService.getVideo("5ecc4eb9d3dc008b28f881a8")
    //setVideoContainers([<Video title={"a"} file={"http://localhost:3001/videos/5ecc4eb9d3dc008b28f881a8"} key = "5ecc4eb9d3dc008b28f881a8"/>])
  },[])

  useEffect(()=>{
    const components = videos.map(v=>{

      return <Video title={v.title} file={`http://localhost:3001/videos/${v.id}`} key={v.id}/>

    })
    setVideoContainers(components)
  },[videos])





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
        formData.append("title", title)
        formData.append("file", file)
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
    {videoContainers}
    <UploadFile handleSubmit={submitFile} fileChange={fileChange} changeTitle={changeTitle}/>
  </div>)
}

export default App;
