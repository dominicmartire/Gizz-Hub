import React, {useState, useEffect} from 'react';
import './App.css';
import videoService from './services/videoService';
import concertService from './services/concertService'
import {
  HashRouter as Router,
  Switch, Route, Link, useParams
} from "react-router-dom"
import Video from './components/video'
import UploadFile from './components/upload'
import Concerts from './components/concerts'
import Concert from './components/concert'



const Error = ({errorMessage}) =>{
  return(
    <div className="errorMessage">
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
  const [concerts, setConcerts] = useState([])
  const [concertId, setConcertId] = useState('')
  const [location, setLocation] = useState('')
  const [concertDate, setConcertDate] = useState('')

  useEffect(()=>{
    videoService.getVideos().then(response=>setVideos(response))
    concertService.getConcerts().then(response=>setConcerts(response))
    document.title="Gizz Hub"
    console.log(concerts)
    console.log(videos)
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

  const error = message=>{
      setErrorState(true)
      setErrorMessage(message)
      setTimeout(()=>{
        setErrorState(false)
        setErrorMessage('')
      }, 5000)
  }

  const submitConcert = async(e)=>{
    e.preventDefault()
    if(location.length === 0){
      error("Please input a location")
    }
    else if(concertDate.length === 0){
      error("Please set the date of the concert")
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
      catch(e){
        error("An error occured while uploading a concert")
      }
    }
  }

  const submitFile = async (e) =>{
    e.preventDefault()
    if(file.size === 0){
      error("Please upload a file")
    }
    else if(title.size === 0){
      error("File has no name")
    }
    else{
      try{
        const formData = new FormData()
        formData.append("title", title)
        formData.append("concertId", concertId)
        formData.append("file", file)

        const result = await videoService.uploadVideo(formData).
        setVideos(videos.concat(result))
      }
      catch(e){
        console.log(e)
        error("Error uploading file")
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
