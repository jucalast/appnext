export const saveMessage = async (message: string, chatId: string, role: "user" | "model") => {
  const userId = "testUserId"; // ID de usuário de teste
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      chatId,
      role,
      userId,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error(`Failed to save ${role} message:`, data);
  }
};
