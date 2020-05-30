import React, {useState, useEffect} from 'react';
import './App.css';
import videoService from './services/videoService';
import concertService from './services/concertService'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams
} from "react-router-dom"
import { PromiseProvider } from 'mongoose';


const Video = ({title, file}) => {
  const [show, setShow] = useState(false)
  return(
    <div className="videoComponent">
      <h2 onClick={()=>setShow(!show)}>{title}</h2>
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
    <div className="errorMessage">
      {errorMessage}
    </div>
  )
}

const Concerts = ({concerts}) =>{
  return(
  <div>
    <h2>Concerts</h2>
    <ul>
      {concerts.map(c=>{
        return(
        <li key={c.id}>
          <Link to={`/concerts/${c.id}`}>{c.location}</Link>
        </li>)
      })}
    </ul>
  </div>)
}

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
    const title = videoObject.title
    return <Video title={title} file={`http://localhost:3001/api/videos/${videoId}`}/>
  })
  changeConcertId(id)
  return(
    <div>
      <div>
        {videoComponents}
      </div>
      {children}
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
  const [concerts, setConcerts] = useState([])
  const [concertId, setConcertId] = useState('')

  useEffect(()=>{
    videoService.getVideos().then(response=>setVideos(response))
    concertService.getConcerts().then(response=>setConcerts(response))
    document.title = "Gizz Hub"
    //videoService.getVideo("5ecc4eb9d3dc008b28f881a8")
    //setVideoContainers([<Video title={"a"} file={"http://localhost:3001/videos/5ecc4eb9d3dc008b28f881a8"} key = "5ecc4eb9d3dc008b28f881a8"/>])
  },[])


  const showConcerts = ()=>{
    const concertComponents =  concerts.map(c=>{
      return (
      <div key={c.id}>
        {c.location}
      </div>)
    })
    return concertComponents
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
        formData.append("title", title)
        formData.append("concertId", concertId)
        formData.append("file", file)
        const result = await videoService.uploadVideo(formData)
        console.log(result)
      }
      catch(e){
        console.log(e)
        setErrorState(true)
        setErrorMessage("Error uploading file")
        setTimeout(()=>{
          setErrorState(false)
          setErrorMessage('')
        }, 5000)
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

  const padding = {
    padding: 5
  }


  return(
  <div>
    <h1 className="header">Gizz Hub: Bootlegs of your favorite band</h1>
    {errorState === true ? <Error errorMessage={errorMessage}/> : <div></div>}
    <Router>
      <div>
        <Link style={padding} to="/">Home</Link>
        <Link style={padding} to="/concerts">Concerts</Link>

        <Switch>
          <Route path="/concerts/:id">
            <Concert concerts={concerts} videos={videos} changeConcertId={setConcertId}>
              <UploadFile handleSubmit={submitFile} fileChange={fileChange} changeTitle={changeTitle}/>
            </Concert>
          </Route>

          <Route path="/concerts">
            <Concerts concerts={concerts}/>
          </Route>

          <Route path="/">
            <div></div>
          </Route>
        </Switch>
      </div>
  </Router>
  </div>)
}

export default App;
