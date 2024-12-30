import React from 'react'
import Postframe from './Postframe'

function Posts() {
  return (
    <div className='size-96'>
      {[1,2,3,4].map((item, index)=>{
        return (
            <Postframe key={index}/>
        )
      })}
    </div>
  )
}

export default Posts
