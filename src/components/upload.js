import React from 'react'

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

export default UploadFile