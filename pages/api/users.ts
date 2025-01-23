import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const { name, email } = req.body;

    try {
      const newUser = await prisma.user.create({
        data: { name, email },
      });

      // Criar um chat associado ao novo usuário
      await prisma.chat.create({
        data: {
          userId: newUser.id,
        },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({ error: "Failed to create user" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
