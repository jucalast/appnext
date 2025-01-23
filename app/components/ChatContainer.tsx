"use client";

import React, { useState } from "react";
import ChatBox from "./ChatBox";
import Messages from "./Messages";
import styles from "./ChatContainer.module.css";

interface ChatContainerProps {
  chatId: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ chatId }) => {
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
      <Messages messages={messages} onNewMessage={handleNewMessage} chatId={chatId} />
      <ChatBox onNewMessage={handleNewMessage} chatId={chatId} />
    </div>
  );
};

export default ChatContainer;
