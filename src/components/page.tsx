import clsx from "clsx";
import Head from "next/head";
import { useStackedPages } from "./hooks";
import { RenderNode } from "./render";
import { StackContext } from "./stack-context";

const PAGE_WIDTH = 600;
export const RenderPage = ({ pages, username, excludeFirstPageParam }) => {
  const {
    stackedPages,
    navigateToNewPage,
    scrollContainer,
    stackedPagesState,
  } = useStackedPages(pages, {
    excludeFirstPage: excludeFirstPageParam,
    pageWidth: PAGE_WIDTH,
    obstructedPageWidth: 40,
  });

  const lastPage = stackedPages[stackedPages.length - 1];

  return (
    <div className="flex min-h-screen overflow-x-auto" ref={scrollContainer}>
      <Head>
        <title>{lastPage.body.title}</title>
      </Head>
      {stackedPages.map((page, index) => (
        <StackContext.Provider
          key={page.id}
          value={{ navigateToNewPage, username, pageIndex: index }}
        >
          <div
            className={clsx(
              "sticky bg-slate-900 text-white first:shadow-none",
              stackedPagesState[index].overlay && "shadow-2xl"
            )}
            style={{
              left: 40 * index,
              minWidth: PAGE_WIDTH,
              width: PAGE_WIDTH,
            }}
          >
            <div className="flex h-full">
              <div className="w-10 pt-6">
                <div
                  className={clsx(
                    "rotate-90 whitespace-nowrap text-slate-400",
                    stackedPagesState[index].obstructed
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                >
                  {page.body.title}
                </div>
              </div>
              <div
                className={clsx(
                  "transition",
                  stackedPagesState[index].obstructed
                    ? "opacity-0"
                    : "opacity-100"
                )}
              >
                <RenderNode page={page.body} username={username} root />
              </div>
            </div>
          </div>
        </StackContext.Provider>
      ))}
    </div>
  );
};
