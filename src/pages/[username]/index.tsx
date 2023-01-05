import type { GetServerSideProps } from "next";
import { prisma } from "../../server/db/client";
import { RenderPage } from "../../components/page";
import { createNotFoundPageStub } from "../../constants/not-found-page";

const UserHomepage = ({ username, pages }) => {
  return (
    <div>
      <div className="px-10 pt-8">
        <h1 className="mb-8 text-lg">{username}</h1>
      </div>
      <RenderPage
        pages={pages}
        username={username}
        excludeFirstPageParam={true}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = context.params?.username as string;
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

  let pageIdsQuery = [user?.rootPageId as string];
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

  const pages = pageIdsQuery.map((id) => {
    const page = _pages.find((p) => p.nodeId === id);
    if (page) return page;
    return createNotFoundPageStub(id);
  });

  return {
    props: {
      username,
      pages: pages,
    }, // will be passed to the page component as props
  };
};

export default UserHomepage;
