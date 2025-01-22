"use client";

import React from "react";
import styles from "./Messages.module.css";

interface MessagesProps {
  messages: { text: string; sender: "user" | "gemini" }[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <div className={styles.messages}>
      {messages.map((msg, index) => (
        <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default Messages;
