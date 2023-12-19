import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from 'react-icons/bs';
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";

function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider();
  const router= useRouter();

  const [isContextMenuVisible,setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates,setContextMenuCoordinates] = useState({
    x: 0,
    y: 0
  });

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCoordinates({x: e.pageX, y: e.pageY});
    setIsContextMenuVisible(true); 
  };

  const contextMenuOptions = [

    {
      name: "Edit Profile", 
      callback: async() => {
      setIsContextMenuVisible(false);
      router.push("/update");
    } },

    {
      name: "New Group", 
      callback: async() => {
      setIsContextMenuVisible(false);
      router.push("http://localhost:8080/");
    } },

     {
      name: "Logout", 
      callback: async() => {
      setIsContextMenuVisible(false);
      router.push("/logout");
    } },
  ];

  useEffect(() => {
    // Ensure that userInfo has been updated before accessing the profileImage
    if (userInfo?.profileImage) {
      console.log("User Info Updated:", userInfo);
    }
  }, [userInfo]);

  const handleAllContactsPage = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profilePicture} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
        className="text-panel-header-icon cursor-pointer text-xl"
        title= "New Chat"
        onClick={handleAllContactsPage}
        />
        <>
        <BsThreeDotsVertical
        className="text-panel-header-icon cursor-pointer text-xl"
        title="Menu"
        onClick={(e)=> showContextMenu(e)}
        id="context-opener"
        />

{
  isContextMenuVisible && (
  <ContextMenu
  options= {contextMenuOptions}
  coordinates={contextMenuCoordinates}
  contextMenu={isContextMenuVisible}
  setContextMenu={setIsContextMenuVisible}
  />
)}
        </>
      </div>

    </div>
  );
}

export default ChatListHeader;