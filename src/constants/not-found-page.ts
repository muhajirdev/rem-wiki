import type { Page } from ".prisma/client";

export const createNotFoundPageStub = (pageId): Page => {
  const page: Page = {
    id: Math.random().toString(),
    nodeId: pageId,
    body: {
      breadcumbs: [],
      id: pageId,
      children: [],
      title: "The page you're looking for is either private or not found",
      text: [
        {
          type: "text",
          content: "The page you're looking for is either private or not found",
        },
      ],
      type: "doc",
    },
    ownerId: Math.random().toString(),
  };
  return page;
};
