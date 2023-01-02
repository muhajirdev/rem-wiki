import clsx from "clsx";
import Link from "next/link";
import { getPageLink } from "../utils/navigation";
import { DocumentLink } from "./stacked-link";

// TODO: handle case for content link
const RenderText = ({ text, nodeType, root }) => {
  return (
    <div
      className={clsx({
        "text-blue-700": nodeType === "doc" && !root,
        "text-gray-800": nodeType === "page",
        "mb-2 text-xl": root,
      })}
    >
      {text
        .filter((x) => x.type === "text")
        .map((x) => x.content)
        .join("")}
    </div>
  );
};

export const RenderNode = ({ page, username, root }) => {
  if (page.type === "doc" && !root)
    return (
      <div className={clsx("leading-7")}>
        <DocumentLink id={page.id}>
          <RenderText text={page.text} nodeType={"node"} root={root} />
        </DocumentLink>
        {/* </Link> */}
        <div className="ml-4">
          {page.children.map((child: any) => (
            <RenderNode key={child.id} page={child} username={username} />
          ))}
        </div>
      </div>
    );
  return (
    <div className={clsx("leading-7")}>
      <div>
        <RenderText text={page.text} nodeType={page.type} root={root} />
      </div>
      <div className="ml-4">
        {page.children.map((child: any) => (
          <RenderNode key={child.id} page={child} username={username} />
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
