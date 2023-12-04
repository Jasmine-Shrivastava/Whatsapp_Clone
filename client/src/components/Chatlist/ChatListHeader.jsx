import React, { useEffect } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from 'react-icons/bs';
import { reducerCases } from "@/context/constants";

function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider();

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
        />
        </>
      </div>

    </div>
  );
}

export default ChatListHeader;