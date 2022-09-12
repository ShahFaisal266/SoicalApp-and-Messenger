import React,{useState,useEffect} from 'react'
import "./conservation.css";
import axios from 'axios';
function Conservation({conversation,currentUser}) {
  const [user,setUser]=useState('');
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
  useEffect(()=>{
    const friendId = conversation.members?.find((m)=>m !==currentUser._id);
    const getUser = async ()=>{
        try{             
            const res = await axios (`/users?userId=${friendId}`)
            setUser(res.data);
            console.log(res); 
        }catch(err){
            console.log(err);
          
        }            
    };        
    getUser()               
},[currentUser, conversation]);  

  return (
    <div className='conservation'>
    <img className='conservationImg' src={user?.ProfilePicture
      ? PF+ user?.ProfilePicture 
      : PF+"person/noAvatar.png"} alt=''/>
    <span className='conservationName'>{user?.username}</span>
      
    </div>
  )
}

export default Conservation
