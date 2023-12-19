import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import React, { useEffect } from "react";
import {FcGoogle} from "react-icons/fc";
import axios from 'axios';
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
function login() {
  const router = useRouter();

  const [{userInfo,newUser}, dispatch] = useStateProvider();

  useEffect(() => {
   
   if(userInfo?.id && !newUser) router.push("/");
  }, [userInfo,newUser]);

  const handlelogin= async()=>{
    // alert("Login");
    const provider=new GoogleAuthProvider();
    const {
      user:{displayName: name,email,photoUrl:profileImage},
  } = await signInWithPopup(firebaseAuth,provider);
  try{
    if(email){
      const { data }= await axios.post(CHECK_USER_ROUTE, { email });
      console.log({data});

      console.log("Email:", email);
      console.log("Data.Status:", data.status);


      
      if(!data.status){
        dispatch({ type: reducerCases.SET_NEW_USER, newUser: true});
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            name,
            email,
            profileImage,
            status: "",
          },
        });
        router.push("/onboarding");
      }
      else{
        console.log("haii");
        const {id, name, email, profilePicture: profileImage, status} = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status,
          },
        });
        router.push("/");
      }
    }
  }catch(err){
    console.log(err);
  }
    //fetching user info from Google SignIn mechanism
    // console.log({user});
  }
  return(
   <div className="flex justify-center items-center bg-chat-background bg-fixed h-screen w-screen flex-col gap-6" style={{ backgroundColor: "#F0F8FF" }}>
    <div className="flex items-center justify-center gap-2 text-white">
      <img src="/whatsapp.gif" alt="whatsapp" height={200} width={200}/>
      <span className="text-6xl font-extrabold text-blue-800 leading-tight tracking-wide">Let's Connect</span>

    </div>
    <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg" style={{ backgroundColor: "#6AAAE1" }} onClick={handlelogin}>
      <FcGoogle className="text-4xl"/>
      <span className="text-white text-2xl">Sign in with Google</span>
    </button>
  </div>
   );
}

export default login;
