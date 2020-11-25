import React, {useState} from 'react'

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

export default Video