import { type NextApiRequest, type NextApiResponse } from "next";
import Cors from "cors";

import { prisma } from "../../server/db/client";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    callback: (result: any) => void
  ) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

type BodySchema = {
  apiKey: string;
  rootId: string;
  documentMappings: {
    [key: string]: any;
  };
};

const publish = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(400).json({ message: "can only accept POST request" });
  }

  const { apiKey, rootId, documentMappings } = req.body as BodySchema;

  const user = await prisma.user.findFirst({
    where: {
      apiKeys: {
        some: {
          key: apiKey,
        },
      },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const listOfPages = Object.values(documentMappings);

  await prisma.page.deleteMany({
    where: {
      ownerId: user.id,
    },
  });

  await prisma.page.createMany({
    data: listOfPages.map((page) => {
      return {
        ownerId: user.id,
        nodeId: page.id,
        body: page,
      };
    }),
  });

  await prisma.user.update({
    data: {
      rootPageId: rootId,
    },
    where: {
      id: user.id,
    },
  });

  return res.status(200).json({ message: "success" });
};

export default publish;
