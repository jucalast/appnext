import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { message, chatId, role } = req.body;
    const userId = "testUserId"; // ID de usuário de teste

    console.log("Dados recebidos:", { message, chatId, role, userId });

    if (!chatId || !message || !role) {
      return res.status(400).json({ error: "chatId, message, and role are required" });
    }

    if (!ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chatId" });
    }

    try {
      // Verificar se o chat existe
      let chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      // Se o chat não existir, criar um novo
      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            id: chatId,
            userId: userId,
          },
        });
        console.log("Novo chat criado:", chat);
      }

      const newMessage = await prisma.message.create({
        data: {
          chatId,
          role,
          parts: [{ text: message }],
        },
      });

      console.log("Nova mensagem criada:", newMessage);

      // Adicionar a mensagem ao chat correspondente
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          messages: {
            connect: { id: newMessage.id },
          },
        },
      });

      console.log("Mensagem adicionada ao chat:", chatId);

      return res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao criar mensagem:", error);
        return res.status(400).json({ error: "Failed to create message", details: error.message });
      } else {
        console.error("Erro desconhecido ao criar mensagem:", error);
        return res.status(400).json({ error: "Failed to create message", details: "Unknown error" });
      }
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
