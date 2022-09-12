import  Message  from '../../components/message/Message';
import React from 'react'
import Conservation from '../../components/conservations/Conservation';
import Topbar from '../../components/topbar/Topbar';
import "./messenger.css";
import Chatonline from "../../components/chatOnline/Chatonline";
import {useContext,useState,useEffect,useRef} from 'react';
import {AuthContext} from '../../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';
import InsertEmotionIcon from "@material-ui/icons/InsertEmoticon";
import axios from 'axios';
import {AttachFile, AttachFileOutlined, FileCopy} from '@material-ui/icons';
import {Mic} from '@material-ui/icons';
import {io} from 'socket.io-client';
export default function Messenger() {
  const {user}=useContext(AuthContext);
  const [conversations,setConversations]=useState([]);
  const [currentChat,setCurrentChat]=useState(null);
  const [messages,setMessages]=useState([]);
  const [arrivalMessage,setArrivalMessages]=useState(null);
  const socket=useRef();
  const [newmessage,setNewMessage]=useState("");
  const [onlineUsers,setoOlineUsers]=useState([]);
  const scrollref=useRef();

  const [pickerVisible,togglePicker]=useState(false);
  const onEmojiClick=(event,emojiObj)=>{
    event.preventDefault();
    setNewMessage(prev=>prev+emojiObj.emoji);
    togglePicker(false);
  };

  useEffect(()=>{
    socket.current=io("ws://localhost:8900");
    socket.current.on("getMessage",(data)=>{
      setArrivalMessages({
        sender:data.senderId,
        text:data.text,
        createdAt:Date.now(),
      });
    });

  },[])

  useEffect(()=>{
    arrivalMessage && 
    currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev)=>[...prev,arrivalMessage])
      
},[arrivalMessage,currentChat])
useEffect(()=>{
  socket.current.emit("addUser",user._id);
  socket.current.on("getUsers",(users)=>{
    setoOlineUsers(user.followings.filter((f)=>users.some(u=>u.userId===f)));
  });
  

},[user])

  useEffect(()=>{
    const getConserv = async ()=>{
      try{
      const res = await axios.get("/conversations/"+user._id)
      setConversations(res.data);
      
    
    }catch(err)
      {
        console.log(err);
      }
    }
    getConserv();
  },[user._id]);

 
 
  


  const handleSumbit =async(e)=>{
    e.preventDefault();
    const message={
      sender:user._id,
      text:newmessage,
      conversationId:currentChat._id,
    };
    const receiverId=currentChat?.members.
    find((member)=>member!==user._id)
    //socket

    socket.current?.emit("sendMessage",{
      senderId:user._id,
      receiverId:receiverId,
      text:newmessage,
    });
    try{
      const res=await axios.post("/messages",message);
      setMessages([...messages,res.data])
      setNewMessage("");
      

    }catch(err)
    {
      console.log(err)
    }
  }
  

  useEffect(()=>{
    const getMessages= async () =>{
      try{
      const res=await axios.get(`/messages/${currentChat._id}`);
      setMessages(res.data);
      
      
      
      }
      catch(err)
      {
        console.log(err);
      }
    }
    getMessages();

  },[currentChat]);

  
  useEffect(()=>{
    scrollref.current?.scrollIntoView({behaviour:"smooth"})

  },[messages])
 
  return (
    <>
    <Topbar/>
    <div className='messenger'>
      <div className='chatMenu'>
      <div className='chatMenuWrapper'>
      <input placeholder='Serach for friends' className="chatMenuInput"></input>
      {conversations?.map((c)=>(
       <div onClick={()=>setCurrentChat(c)}>
        <Conservation conversation={c} currentUser={user}/>
        </div>
        ))}
      
      </div>
      </div>
      <div className="chatBox">

      <div className="chatBoxWrapper">
      { 
        currentChat ? (
      <>
      
      <div className="chatBoxTop">
      {messages?.map(m=>(
        <div ref={scrollref}>
        <Message message={m} own={m.sender===user._id}/>
     </div>
        ))}
      

      </div>
      <div className='chatBoxBottom'>
      <div className="chatNewThings">
  
      <Mic/>
      <AttachFile/>
      {pickerVisible &&(
        <EmojiPicker className="emoji_picker" onEmojiClick={onEmojiClick}/>
      )}
      
        <InsertEmotionIcon  onClick={()=>togglePicker(!pickerVisible)}/>
      </div>
     
      <textarea  className='chatMessageInput'
      
      placeholder="Send a message here"
      onChange={(e)=>setNewMessage(e.target.value)}
      value={newmessage}
      >
      </textarea>
      
      <button className='chatSubmit' onClick={handleSumbit}>Send </button>
      

      </div>
      </>
      ) : (
        
        
  
        <span className="noConversationText">Open a Conversation to start a chat.</span>
      )}
    

      </div>
      </div>
      <div className='chatOnline'>
      <div className='chatOnlineWrapper'>
      <Chatonline onlineUsers={onlineUsers} 
      currentId={user._id} 
      setCurrentChat={setCurrentChat}/>
     
      </div>
     
      </div>
      
    </div>
    </>
  );
}


