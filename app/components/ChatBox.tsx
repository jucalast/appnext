"use client";

import React, { useState, useEffect } from "react";
import styles from "./ChatBox.module.css";
import Modal from "./Modal";
import SoundRecorder from "./SoundRecorder";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatBoxProps {
  onNewMessage: (message: string, sender: "user" | "gemini") => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onNewMessage }) => {
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      onNewMessage(userMessage, "user");
      setInput("");

      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("GEMINI_API_KEY não está definida");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userMessage);
        const aiMessage = result.response.text();

        onNewMessage(aiMessage, "gemini");
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        onNewMessage("Erro ao enviar mensagem. Tente novamente.", "gemini");
      }
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
