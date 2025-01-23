"use client";

import React, { useState, useEffect } from "react";
import styles from "./ChatBox.module.css";
import Modal from "./Modal";
import SoundRecorder from "./SoundRecorder";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";

interface ChatBoxProps {
  onNewMessage: (message: string, sender: "user" | "gemini") => void;
  chatId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onNewMessage, chatId }) => {
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("NEXT_PUBLIC_GEMINI_API_KEY:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      onNewMessage(userMessage, "user");
      setInput("");
    }
  };

  const handleRecord = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={`${styles.chatContainer} chatBox`}>
      <div className={styles.inputContainer}>
        <textarea
          className={styles.chatInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button className={styles.recordButton} onClick={handleRecord}>
          <FaMicrophone />
        </button>
        <button className={styles.chatButton} onClick={handleSend}>
          <FaArrowUp />
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SoundRecorder />
      </Modal>
    </div>
  );
};

export default ChatBox;
