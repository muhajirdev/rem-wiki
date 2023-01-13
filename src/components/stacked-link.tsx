import { useContext, useEffect } from "react";
import { getPageLink } from "../utils/navigation";
import { StackContext } from "./stack-context";
import { useQueryClient } from "@tanstack/react-query";
import { trpc, trpcClient } from "../utils/trpc";
import { createNotFoundPageStub } from "../constants/not-found-page";
import { fetchPageOrReturnNotFoundStub } from "../utils/fetch";

export const DocumentLink = ({ id, children }) => {
  const context = useContext(StackContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    const key = trpc.page.getPage.getQueryKey({ id });
    queryClient.prefetchQuery({
      queryKey: key,
      staleTime: 100000000,
      cacheTime: 100000000,
      queryFn: async () => {
        const data = await fetchPageOrReturnNotFoundStub(id);
        console.log(data);
        return data;
      },
    });
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    context.navigateToNewPage(id, context.pageIndex);
  };

  return (
    <a
      className="hover:underline"
      onClick={onClick}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      href={getPageLink(context.username, id)}
    >
      {children}
    </a>
  );
};
