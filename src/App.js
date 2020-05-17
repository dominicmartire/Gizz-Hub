import React, {useState, useEffect} from 'react';
import './App.css';
import videoService from './services/videoService';

const Video = ({title, file}) => {
  console.log(file)
  return(
    <div>
      <div>{title}</div>
      <video id="video" src={file} controls>
      </video>
    </div>
  )
}

const UploadFile = ({handleSubmit, fileChange, changeTitle}) =>{
  return(
    <div>
      <div>Upload new video</div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" onChange={changeTitle}/>
        </div>
        <div>
          <input type="file" accept=".mp4, .wav, .ogg, .ogv" onChange={fileChange}/>
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


  useEffect(()=>{
    const retrieve = async () =>{
      const data = await videoService.getVideos()
      const videoBlobs = data.map(v =>{
        const fileString = v.file
        const blob = stringToBlob(fileString)
        return {
          title: v.title,
          file: blob,
          id: v.id
        }
      })
      setVideos(videoBlobs)
    }
    document.title = "Gizz Hub"
    retrieve()
  },[])

  const renderVideos = () =>{
    console.log("videos")
    const videoComponents = videos.map(v=>{
      return <Video title={v.title} file={v.file} key={v.id}/>
    })
    return videoComponents
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
      const fileBuffer = await writeFileToBuffer(file)
      const fileString = Buffer.from(fileBuffer).toString('ascii')
      const submission = {
        title: title,
        file: fileString
      }
      try{
        await videoService.uploadVideo(submission)
      }
      catch(e){
        console.log(e)
      }
    }
  }

  const writeFileToBuffer = (file) => {
    console.log("Uploaded file")
    console.log(file)
    return new Promise((resolve, reject)=>{
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      reader.abort = reject
      reader.readAsArrayBuffer(file)
    })
  }

  const stringToBlob = (string) =>{
    //const buffer = Buffer.from(string, 'ascii')
    const buffer = new ArrayBuffer(string.length)
    const charBuffer = new Uint8Array(buffer)
    for(let i = 0; i < string.length; i++){
      charBuffer[i] = string.charCodeAt(i)
    }
    const file = new Blob(charBuffer)
    return URL.createObjectURL(file)
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
    {renderVideos()}
    <UploadFile handleSubmit={submitFile} fileChange={fileChange} changeTitle={changeTitle}/>
  </div>)
}

export default App;
