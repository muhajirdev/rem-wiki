import type { GetServerSideProps } from "next";
import { prisma } from "../../server/db/client";
import { RenderPage } from "../../components/page";
import { createNotFoundPageStub } from "../../constants/not-found-page";
import { useTheme } from "../../components/theme";
import { ThemeSwitcher } from "../../components/theme-switcher";

const UserHomepage = ({ username, pages }) => {
  const [theme] = useTheme();
  return (
    <div className={theme}>
      <div className={"bg-white dark:bg-slate-900"}>
        <div className="mb-8 flex justify-between border-b px-4 py-6 dark:border-slate-800 md:px-10">
          <a href={`/${username}`}>
            <h1 className="text-lg text-black dark:text-white">{username}</h1>
          </a>
          <ThemeSwitcher />
        </div>
        <RenderPage
          pages={pages}
          username={username}
          excludeFirstPageParam={true}
        />
      </div>
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

  let pageIdsQuery = [];
  if (user?.rootPageId) {
    pageIdsQuery.push(user?.rootPageId as string);
  }

  if (pageIds) {
    pageIdsQuery = [...pageIdsQuery, ...pageIds];
  }

  if (pageIdsQuery.length === 0) {
    return {
      notFound: true,
    };
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
