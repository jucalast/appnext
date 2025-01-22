"use client";

import React, { useState } from "react";
import ChatBox from "./ChatBox";
import Messages from "./Messages";
import styles from "./ChatContainer.module.css";

interface ChatContainerProps {
  // Remova a prop onFirstMessageSent
}

const ChatContainer: React.FC<ChatContainerProps> = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "gemini" }[]>([]);
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);

  const handleNewMessage = (newMessage: string, sender: "user" | "gemini") => {
    setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender }]);
    if (!isFirstMessageSent) {
      setIsFirstMessageSent(true);
    }
  };

  return (
    <div className={`${styles.chatContainer} ${isFirstMessageSent ? styles.messagesView : ""}`}>
      <Messages messages={messages} />
      <ChatBox onNewMessage={handleNewMessage} />
    </div>
  );
};

export default ChatContainer;
