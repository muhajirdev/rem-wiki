import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import throttle from "lodash.throttle";

import { useQueryClient } from "@tanstack/react-query";
import { trpc, trpcClient } from "../utils/trpc";

const throttleTime = 16;
const obstructedOffset = 120;

function useScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState(0);
  const [width, setWidth] = useState(0);

  const scrollObserver = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    setScroll(containerRef.current.scrollLeft);
    setWidth(containerRef.current.getBoundingClientRect().width);
  }, [setScroll, setWidth, containerRef]);

  const throttledScrollObserver = throttle(scrollObserver, throttleTime);

  const setRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      // When the ref is first set (after mounting)
      node.addEventListener("scroll", throttledScrollObserver);
      containerRef.current = node;
      window.addEventListener("resize", throttledScrollObserver);
      throttledScrollObserver(); // initialization
    } else if (containerRef.current) {
      // When unmounting
      containerRef.current.removeEventListener(
        "scroll",
        throttledScrollObserver
      );
      window.removeEventListener("resize", throttledScrollObserver);
    }
  }, []);

  return [scroll, width, setRef, containerRef] as const;
}

export const useStackedPages = (
  pages,
  { excludeFirstPage, pageWidth, obstructedPageWidth }
) => {
  const [scroll, containerWidth, setRef, containerRef] = useScroll();
  const router = useRouter();
  const [stackedPages, setStackedPages] = useState(pages);
  const queryClient = useQueryClient();

  const getPage = async (pageId) => {
    const key = trpc.page.getPage.getQueryKey({ id: pageId });
    const page = await queryClient.fetchQuery({
      queryKey: key,
      staleTime: 100000000,
      cacheTime: 100000000,
      queryFn: async () => {
        const data = await trpcClient.page.getPage.query({ id: pageId });
        return data;
      },
    });
    return page;
  };

  const addPage = async (page, fromPageIndex: number) => {
    const persistedPages = stackedPages.slice(0, fromPageIndex + 1);
    const newPages = [...persistedPages, page];
    setStackedPages(newPages);

    router.push(
      {
        pathname: router.pathname,
        query: {
          pageId: excludeFirstPage
            ? newPages.map((page) => page.body.id).slice(1)
            : newPages.map((page) => page.body.id),
          username: router.query.username,
        },
      },
      null,
      { shallow: true }
    );

    setTimeout(() => {
      containerRef.current?.scrollTo({
        behavior: "smooth",
        top: 0,
        left: pageWidth * newPages.length,
      });
    }, 100);
  };

  const navigateToNewPage = async (pageId: string, fromPageIndex: number) => {
    const page = await getPage(pageId);
    addPage(page, fromPageIndex);
  };

  const stackedPagesState = stackedPages.map((page, i) => ({
    overlay: scroll > pageWidth * (i - 1),
    obstructed: scroll > pageWidth * (i + 1) - obstructedPageWidth * 3,
    // scroll >
    //   Math.max(
    //     pageWidth * (i + 1) -
    //       obstructedOffset -
    //       obstructedPageWidth * (i - 1),
    //     0
    //   ) || scroll + containerWidth < pageWidth * i + obstructedOffset,
  }));

  return {
    stackedPages,
    addPage,
    navigateToNewPage,
    scrollContainer: setRef,
    stackedPagesState,
  };
};
