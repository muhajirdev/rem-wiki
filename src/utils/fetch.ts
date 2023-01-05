import { createNotFoundPageStub } from "../constants/not-found-page";
import { trpcClient } from "./trpc";

export const fetchPageOrReturnNotFoundStub = async (id) => {
  const data = await trpcClient.page.getPage.query({ id });
  if (!data) return createNotFoundPageStub(id);
  return data;
};
