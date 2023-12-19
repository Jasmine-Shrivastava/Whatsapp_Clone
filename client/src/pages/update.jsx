import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import { ONBOARD_USER_ROUTE, CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { reducerCases } from "@/context/constants";

// ... (existing imports)

function Update() {
    const router = useRouter();
    const [{ userInfo, newUser }, dispatch] = useStateProvider();
    const [name, setName] = useState(userInfo?.name || "");
    const [about, setAbout] = useState(userInfo?.about || "");
    const [image, setImage] = useState(userInfo?.profilePicture || "/default_avatar.png");
  
    useEffect(() => {
      // Check if there is a user logged in
      if (!newUser && !userInfo?.email) router.push("/login");
    }, [newUser, userInfo?.email, router]);
  
    const updateProfileHandler = async () => {
      if (validateDetails()) {
        const email = userInfo.email;
        try {
          const { data } = await axios.post(ONBOARD_USER_ROUTE, {
            email,
            name,
            about,
            image,
          });
  
          console.log(data.status);
          if (data.status) {
            dispatch({
              type: reducerCases.SET_USER_INFO,
              userInfo: {
                id: data.user.id,
                name,
                email,
                profilePicture: image,
                about: about,
              },
            });
            router.push("/");
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
  
    const validateDetails = () => {
      if (name.length < 3) {
        return false;
      }
      return true;
    };
  
    return (
      <div className="bg-chat-background bg-fixed h-screen w-screen text-black flex flex-col items-center justify-center" style={{ backgroundColor: "#F0F8FF" }}>
      <div className="flex flex-col items-center justify-center space-y-6">
        <img src="/whatsapp.gif" alt="whatsapp" className="w-40 h-40" />
        <h1 className="text-6xl font-extrabold text-blue-800 leading-tight tracking-wide">Let's Connect</h1>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Edit your profile</h2>
      <div className="flex gap-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <label className="text-lg font-semibold">Display Name</label>
          <input
            type="text"
            className="border-2 border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:border-blue-600 transition duration-300"
            placeholder="Enter your display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
           <label className="text-lg font-semibold">About</label>
           <input
            type="text"
            className="border-2 border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:border-blue-600 transition duration-300"
            placeholder="Tell us about yourself"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <div>
          {/* Assuming Avatar is a custom component */}
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
      <button
        className="bg-blue-500 text-white p-3 rounded-lg mt-6 hover:bg-blue-600 transition duration-300"
        onClick={updateProfileHandler}
      >
        Confirm Updation
      </button>
    </div>
    
    );
  }
  
  export default Update;
  