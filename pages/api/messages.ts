import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { message, userId, role } = req.body;

    try {
      const newMessage = await prisma.message.create({
        data: {
          chatId: userId,
          role,
          parts: { text: message },
        },
      });

      return res.status(201).json(newMessage);
    } catch (error) {
      return res.status(400).json({ error: "Failed to create message" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
