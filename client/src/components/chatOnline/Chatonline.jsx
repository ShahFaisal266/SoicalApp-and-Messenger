import axios from 'axios';
import React,{useState,useEffect} from 'react'
import "./chatonline.css";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
function Chatonline({onlineUsers,currentId,setCurrentChat}) {
  const [friends,setFriends]=useState([]);

  const [onlineFriends,setOnilineFirends]=useState([])

  const handleClick= async (user)=>{
    try{
      const res= await axios.get(
        `/conversations/find/${currentId}/${user._id}`);
      setCurrentChat(res.data);
    }
    catch(err)
    {
      console.log(err);
    }

  }

  useEffect(() => {
   const getFriends=async()=>{
    try{
    const res= await axios.get(`/users/friends/${currentId}`);
    setFriends(res.data);
  
    }catch(err)
    {
      console.log(err);
    }
   }
   getFriends();
  }, [currentId]);
  useEffect(()=>{
    setOnilineFirends(friends.filter((f)=>onlineUsers.
    includes(f._id)));


  },[friends,onlineUsers]);
  //console.log(onlineUsers);
  return (
    <div className='chatOnline'>
    {onlineFriends.map((o)=>(

   
    <div className='chatOnlineFriend' 
    onClick={()=>
      handleClick(o)
    }>
    <div className='chatOnlineImgContainer'>
    <img className='chatOnlineImg' 
    src={o?.profilePicture ? 
      PF+o.profilePicture 
      :PF+"person/noAvatar.png"
    }
     alt=''/>
    <div className="chatOnlineBadge"></div>
    </div>
    <span className='chatOnlineName'>{o?.username}</span>
    </div> 
    
    ))}
    </div>

    
  )
}

export default Chatonline;
