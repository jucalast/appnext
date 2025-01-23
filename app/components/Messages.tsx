"use client";

import React, { useState, useEffect } from "react";
import styles from "./Messages.module.css";
import { sendMessageStream, addMessageToHistory } from "../utils/api";

interface MessagesProps {
  messages: { text: string; sender: "user" | "gemini" }[];
  onNewMessage: (message: string, sender: "user" | "gemini") => void;
  chatId: string;
}

const formatMessage = (text: string) => {
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Negrito
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Itálico
    .replace(/\n/g, "<br />") // Quebra de linha
    .replace(/^\*\s/gm, "<ul><li>") // Lista não ordenada
    .replace(/\n\*\s/g, "</li><li>") // Lista não ordenada
    .replace(/<\/li><li>$/, "</li></ul>") // Fechar lista não ordenada
    .replace(/<\/li><br \/>/g, "</li>") // Remover <br /> extra após </li>
    .replace(/<br \/><ul>/g, "<ul>") // Remover <br /> extra antes de <ul>
    .replace(/\*\s/g, "<li>") // Transformar asteriscos em tópicos
    .replace(/<\/li>/g, "</li></ul>"); // Fechar lista não ordenada
  return { __html: formattedText };
};

const Messages: React.FC<MessagesProps> = ({ messages, onNewMessage, chatId }) => {
  const [streamingMessage, setStreamingMessage] = useState("");

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === "user") {
      setStreamingMessage(""); // Resetar a mensagem de streaming antes de iniciar uma nova
      const userMessage = messages[messages.length - 1].text;
      addMessageToHistory("user", userMessage); // Adicionar mensagem do usuário ao histórico
      let completeMessage = "";
      sendMessageStream(userMessage, chatId, (chunkText) => {
        completeMessage += chunkText;
        setStreamingMessage(completeMessage);
      }).then(() => {
        if (completeMessage) {
          setStreamingMessage(""); // Limpar a mensagem de streaming após completar
          addMessageToHistory("model", completeMessage); // Adicionar resposta do modelo ao histórico
          onNewMessage(completeMessage, "gemini"); // Enviar a mensagem completa uma vez
        }
      }).catch((error) => {
        console.error("Erro ao buscar mensagem de streaming:", error);
        onNewMessage("Erro ao buscar mensagem de streaming. Tente novamente.", "gemini");
      });
    }
  }, [messages, onNewMessage, chatId]);

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${styles[msg.sender]}`}
            dangerouslySetInnerHTML={formatMessage(msg.text)}
          />
        ))}
        {streamingMessage && (
          <div
            className={`${styles.message} ${styles.gemini} ${styles.streaming}`}
            style={{ transition: "opacity 0.5s ease-in-out" }}
            dangerouslySetInnerHTML={formatMessage(streamingMessage)}
          />
        )}
      </div>
    </div>
  );
};

export default Messages;
