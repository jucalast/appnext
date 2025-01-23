import { GoogleGenerativeAI } from "@google/generative-ai";

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

export const sendMessage = async (message: string, userId: string) => {
  const result = await chat.sendMessage(message);
  const responseText = result.response.text();

  // Salvar mensagem do usuário e resposta do modelo no banco de dados via API
  await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      userId,
      role: "user",
    }),
  });

  await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: responseText,
      userId,
      role: "model",
    }),
  });

  return responseText;
};

export const sendMessageStream = async (message: string, userId: string, onChunk: (chunkText: string) => void) => {
  const result = await chat.sendMessageStream(message);

  let completeMessage = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    completeMessage += chunkText;
    onChunk(chunkText);
  }

  // Salvar mensagem do usuário e resposta do modelo no banco de dados via API
  await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      userId,
      role: "user",
    }),
  });

  await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: completeMessage,
      userId,
      role: "model",
    }),
  });
};

export const addMessageToHistory = (role: "user" | "model", text: string) => {
  chatHistory.push({ role, text });
  chat = updateChat(); // Atualizar a sessão de chat com o novo histórico
};
