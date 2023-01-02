import type { GetServerSideProps } from "next";
import { prisma } from "../../server/db/client";
import { RenderPage } from "../../components/page";
import { RenderBreadcumbs, RenderNode } from "../../components/render";

const Page = ({ username, pages }) => {
  return (
    <div>
      <h1>{username}</h1>
      <RenderBreadcumbs page={pages[0]} username={username} />
      <RenderPage pages={pages} username={username} excludeFirstPageParam />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = context.params?.username as string;
  const rootPageId = context.params?.rootPageId as string;
  const pageId = context.query.pageId;

  const pageIds = typeof pageId === "string" ? [pageId] : pageId;

  if (!username) {
    return {
      notFound: true,
    };
  }

  const user = await prisma?.user.findUnique({
    where: {
      username,
    },
  });

  let pageIdsQuery = [rootPageId as string];
  if (pageIds) {
    pageIdsQuery = [...pageIdsQuery, ...pageIds];
  }

  const _pages = await prisma?.page.findMany({
    where: {
      nodeId: {
        in: pageIdsQuery,
      },
    },
  });

  const pages = pageIdsQuery.map((id) => _pages.find((p) => p.nodeId === id));

  return {
    props: {
      username,
      pages: pages,
    }, // will be passed to the page component as props
  };
};

export default Page;
