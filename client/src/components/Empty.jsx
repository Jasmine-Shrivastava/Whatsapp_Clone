import Image from "next/image";
import React from "react";

function Empty() {
  return (
   <div className="bg-chat-background bg-fixed border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center "style={{ backgroundColor: "#F0F8FF" }}>
    <img src="/whatsapp.gif" alt="chatapp" height={200} width={200} />
  </div>
  );
}

export default Empty;