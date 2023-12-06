import React, { useEffect, useReducer, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";

function Main() {
  const router=useRouter();
  const [{userInfo, currentChatUser, messagesSearch, videoCall, voiceCall, incomingVoiceCall, incomingVideoCall },dispatch]=useStateProvider();
  const [redirectLogin,setRedirectLogin]=useState(false);
  const[socketEvent,setSocketEvent]=useState(false);
  const socket = useRef(); 
  useEffect(()=>{
    if(redirectLogin) router.push("/login");
  },[redirectLogin]);

  onAuthStateChanged(firebaseAuth,async(currentUser)=>{
    if(!currentUser) setRedirectLogin(true);
    if(!userInfo && currentUser?.email){
      const {data} =await axios.post(CHECK_USER_ROUTE, {
        email:currentUser.email
      });
   // }
      if(!data.status){
        router.push("/login");
      }
      console.log(data);
      if(data?.data){
        
      const {id,name,email,profilePicture,about}=data.data;
      dispatch({
        type:reducerCases.SET_USER_INFO,
        userInfo:{
          id,
          name,
          email,
          profilePicture,
          about,
        },
      });
    }
  }
  console.log(userInfo);
  });

  useEffect(()=>{
    if(userInfo){
      socket.current = io(HOST);
      socket.current.emit("add-user",userInfo.id);
      dispatch({type:reducerCases.SET_SOCKET,socket});
    }
  },[userInfo]);

  useEffect(()=> {
    if(socket.current && !socketEvent){
     socket.current.on("msg-receive",(data)=>{
        dispatch({
          type:reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
            
          },
        });
     });
       socket.current.on("incoming-voice-call",({from, roomId, callType})=>{
          dispatch({
            type:reducerCases.SET_INCOMING_VOICE_CALL,
            incomingVoiceCall: { ...from, roomId, callType },
          });
       });

       socket.current.on("incoming-video-call",({from, roomId, callType})=>{
        dispatch({
          type:reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
     });

     socket.current.on("voice-call-rejected",()=>{
      dispatch({
        type:reducerCases.END_CALL,
      });
   });

   socket.current.on("video-call-rejected",()=>{
    dispatch({
      type:reducerCases.END_CALL,
    });
 });
 
 socket.current.on("online-users", ({ onlineUsers})=>{
  dispatch({
    type: reducerCases.SET_ONLINE_USERS,
    onlineUsers,
  });
 });
 
      setSocketEvent(true);
    }
  },[socket.current]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        //if (currentChatUser?.id) {
         // const url = `${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`;
          const { 
            data: { messages },
         } = await axios.get(
            `${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`
            );
         // console.log({ data });
          dispatch({type:reducerCases.SET_MESSAGES,messages});
      // }
      } catch (error) {
        // Handle errors here
        if (error.response) {
          // The request was made, but the server responded with a status code
          // other than 2xx (e.g., 404, 500).
          console.error("Server responded with an error:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received.
          console.error("No response received from the server:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error.
          console.error("Error setting up the request:", error.message);
        }
      }
    };
    if (currentChatUser?.id) {
    getMessages();
    }
  }, [currentChatUser,userInfo]);
  


  return(
    <>

    {incomingVideoCall && <IncomingVideoCall/>}
    {incomingVoiceCall && <IncomingCall/>}

    {
      videoCall && (
      <div className="h-screen w-screen max-h-full overflow-hidden">
        <VideoCall/>
      </div>
    )}

{
      voiceCall && (
      <div className="h-screen w-screen max-h-full overflow-hidden">
        <VoiceCall/>
      </div>
    )}

    {
      !videoCall && !voiceCall &&
    
   (<div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
     <ChatList />
     {
       currentChatUser ? ( 
       <div className={messagesSearch?"grid grid-cols-2": "grid-cols-2"}>
         <Chat/> 
          {
            messagesSearch && <SearchMessages />
          }
          </div>
      ) : (<Empty/>
     )}
   
     
   </div>
)}
   </>
   );
 }

export default Main;