import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

type BodySchema = {
  username: string;
  rootId: string;
  documentMappings: {
    [key: string]: any;
  };
};

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "can only accept POST request" });
  }

  const { username, rootId, documentMappings } = req.body;

  const user = await prisma.user.findFirst();

  // const examples = await prisma.example.findMany();
  // res.status(200).json(examples);
};

export default examples;
