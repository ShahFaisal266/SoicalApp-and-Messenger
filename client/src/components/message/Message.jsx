import React from 'react'
import "./message.css"
import {format} from 'timeago.js';
function Message({message,own}) {
  return (
    <div className={own ? "message own": "message"}>
    <div className='messageTop'>
    <img  className='messageImg' src='https://yt3.ggpht.com/yti/AJo0G0nvz2lS8zLaaWblqzAY4VgT796TABv1BVF9SIdR=s88-c-k-c0x00ffffff-no-rj-mo' alt=''/>
    <p className='messageText'>{message.text}</p>
    </div>
      
    <div className='messageBottom'>
    {format(message.createdAt)}
    </div>
    </div>
  )
}

export default Message
