import React from 'react'
import {Link} from 'react-router-dom'

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

export default Concerts