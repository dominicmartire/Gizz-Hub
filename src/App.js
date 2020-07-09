import React, {useState, useEffect} from 'react';
import './App.css';
import videoService from './services/videoService';
import concertService from './services/concertService'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams
} from "react-router-dom"


const Video = ({title, url}) => {
  const [show, setShow] = useState(false)

  return(
    <div className="videoComponent">
      <div className="hoverTitle">
        <h3 onClick={()=>setShow(!show)}>{title}</h3>
        <div className="hoverText">{show ? "click to hide video" : "click to show video"}</div>
      </div>
      {show ? <video id="video" width="640" height="480" src={url} controls>
      </video> : null}
    </div>
  )
}

const UploadFile = ({handleSubmit, fileChange, changeTitle}) =>{
  return(
    <div>
      <div>Upload new video</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="formFields">
          <div>
          <input type="text" onChange={e=>changeTitle(e.target.value)}/>
          </div>

          <div>
          <input type="file" name="file" accept=".mp4, .wav, .ogg, .ogv" onChange={fileChange}/>
          </div>

          <div>
          <button type="submit">Submit</button>
          </div>
        </div>
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

const Concerts = ({concerts, setDate, setLocation, handleSubmit}) =>{
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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="formFields">
          <div>
            <input type="text" onChange={e=>setLocation(e.target.value)}/>
          </div>
          <div>
            <input type="date" onChange={e=>setDate(e.target.value)}/>
          </div>
          
          <div>
          <button type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
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
    if(typeof videoObject !== 'undefined'){
      const title = videoObject.title
      return <Video key={videoId} title={title} url={videoService.videoUrl(videoId)}/>
      //return <Video key={videoId} title={title} file={`http://localhost:3001/api/videos/${videoId}`}/>
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

const App = () =>{
  const [videos, setVideos] = useState([])
  const [file, setFile] = useState(new Blob())
  const [errorState, setErrorState] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('')
  const [videoContainers, setVideoContainers] = useState([])
  const [concerts, setConcerts] = useState([])
  const [concertId, setConcertId] = useState('')
  const [location, setLocation] = useState('')
  const [concertDate, setConcertDate] = useState('')

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

  const submitConcert = async(e)=>{
    e.preventDefault()
    if(location.length === 0){
      setErrorState(true)
      setErrorMessage("Please say the location of the concert")
      setTimeout(()=>{
        setErrorState(false)
        setErrorMessage('')
      }, 5000)
    }
    else if(concertDate.length === 0){
      setErrorState(true)
      setErrorMessage("Please say the date of the concert")
      setTimeout(()=>{
        setErrorState(false)
        setErrorMessage('')
      }, 5000)
    }
    else{
      try{
        const formData = new FormData()
        formData.append("location", location)
        formData.append("date", concertDate)
        console.log(location, concertDate)
        const result = await concertService.uploadConcert(formData)
        setConcerts(concerts.concat(result))
      }
      catch(e){}
    }
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
        setVideos(videos.concat(result))
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




  const padding = {
    padding: 5
  }


  return(
  <div>
    <div className="header">
      <h1>
      Gizz Hub: Bootlegs of your favorite band
      </h1>
    </div>
    {errorState === true ? <Error errorMessage={errorMessage}/> : <div></div>}
    <Router>
      <div>
        <Link style={padding} to="/">Home</Link>
        <Link style={padding} to="/concerts">Concerts</Link>

        <Switch>
          <Route path="/concerts/:id">
            <Concert concerts={concerts} videos={videos} changeConcertId={setConcertId}>
              <UploadFile handleSubmit={submitFile} fileChange={fileChange} changeTitle={setTitle}/>
            </Concert>
          </Route>

          <Route path="/concerts">
            <Concerts concerts={concerts} setDate={setConcertDate} setLocation={setLocation} handleSubmit={submitConcert}/>
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
