import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveMessage } from "./database";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY não está definida");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chatHistory: { role: "user" | "model"; text: string }[] = [];

const updateChat = () => {
  return model.startChat({
    history: chatHistory.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    })),
  });
};

let chat = updateChat();

export const sendMessage = async (message: string, chatId: string) => {
  const result = await chat.sendMessage(message);
  const responseText = result.response.text();

  console.log("Enviando mensagem do usuário:", { message, chatId, role: "user" });

  await saveMessage(message, chatId, "user");
  console.log("Enviando mensagem do modelo:", { message: responseText, chatId, role: "model" });
  await saveMessage(responseText, chatId, "model");

  return responseText;
};

export const sendMessageStream = async (message: string, chatId: string, onChunk: (chunkText: string) => void) => {
  const result = await chat.sendMessageStream(message);

  let completeMessage = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    completeMessage += chunkText;
    onChunk(chunkText);
  }

  console.log("Enviando mensagem do usuário (stream):", { message, chatId, role: "user" });

  await saveMessage(message, chatId, "user");
  console.log("Enviando mensagem do modelo (stream):", { message: completeMessage, chatId, role: "model" });
  await saveMessage(completeMessage, chatId, "model");
};

export const addMessageToHistory = (role: "user" | "model", text: string) => {
  chatHistory.push({ role, text });
  chat = updateChat(); // Atualizar a sessão de chat com o novo histórico
};
