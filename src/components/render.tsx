import clsx from "clsx";
import Link from "next/link";
import { getPageLink } from "../utils/navigation";
import { DocumentLink } from "./stacked-link";

const RenderText = ({ text, nodeType, root, link, header }) => {
  return (
    <span
      className={clsx({
        "mb-2 text-3xl font-semibold tracking-wide text-black dark:text-white":
          root,
        "text-blue-500 dark:text-blue-300": link,
        "text-black dark:text-white": header,
      })}
    >
      {text.map((x) => {
        if (x.type === "text") return x.content;
        if (x.type === "link" && x.url) {
          return (
            <a
              rel="noreferrer"
              href={x.url}
              target="_blank"
              id={x.id}
              key={x.id}
            >
              <RenderText
                text={x.content}
                nodeType={x.nodeType}
                root={root}
                link={true}
                header={false}
              />
            </a>
          );
        }
        if (x.type === "link") {
          return (
            <DocumentLink id={x.id} key={x.id}>
              <RenderText
                text={x.content}
                nodeType={x.nodeType}
                root={root}
                link={true}
                header={false}
              />
            </DocumentLink>
          );
        }
      })}
    </span>
  );
};

export const RenderNode = ({ page, username, root }) => {
  const isHeader =
    page.fontSize === "H1" || page.fontSize === "H2" || page.fontSize === "H3";

  if (page.type === "doc" && !root)
    return (
      <div className={clsx("leading-7")}>
        <DocumentLink id={page.id}>
          <div
            className={clsx({
              "text-2xl": page.fontSize === "H1",
              "text-xl": page.fontSize === "H2",
              "text-lg": page.fontSize === "H3",
            })}
          >
            <RenderText
              text={page.text}
              nodeType={"node"}
              root={root}
              header={false}
              link={true}
            />
          </div>
        </DocumentLink>
        <div className={clsx(!root && "ml-4")}>
          {page.children.map((child: any) => (
            <RenderNode
              key={child.id}
              page={child}
              username={username}
              root={false}
            />
          ))}
        </div>
      </div>
    );
  return (
    <div className={clsx("leading-7")}>
      <div
        className={clsx({
          "text-2xl": page.fontSize === "H1",
          "text-xl": page.fontSize === "H2",
          "text-lg": page.fontSize === "H3",
          "mb-4": root,
          "mb-2": !root,
        })}
      >
        <RenderText
          text={page.text}
          nodeType={page.type}
          root={root}
          header={isHeader}
          link={false}
        />
      </div>
      <div className={clsx(!root && "ml-4")}>
        {page.children.map((child: any) => (
          <RenderNode
            key={child.id}
            page={child}
            username={username}
            root={false}
          />
        ))}
      </div>
    </div>
  );
};

export const RenderBreadcumbs = ({ page, username }) => {
  if (!page.breadcumbs) return null;
  if (page.breadcumbs.length === 0) return null;

  return (
    <div className="">
      {page.breadcumbs.map((x) => (
        <Link
          className="before:mr-1 before:content-['/'] first:before:mr-0 first:before:content-['']"
          key={x.id}
          href={getPageLink(username, x.id)}
        >
          {x.title}
        </Link>
      ))}
    </div>
  );
};
