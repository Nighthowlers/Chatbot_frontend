import React, { useState } from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import ChatWindow from "../component/ChatWindow";

function ChatPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState("normal");

  return (
    <div className="flex h-screen bg-[#0b1020] text-white">
      
      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setCollapsed(!collapsed)} mode={mode} setMode={setMode} />
        <ChatWindow mode={mode} />
      </div>

    </div>
  );
}

export default ChatPage;