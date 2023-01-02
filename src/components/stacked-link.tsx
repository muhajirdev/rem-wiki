import { useContext } from "react";
import { getPageLink } from "../utils/navigation";
import { StackContext } from "./stack-context";

export const DocumentLink = ({ id, children }) => {
  const context = useContext(StackContext);

  const onClick = (e) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    context.navigateToNewPage(id, context.pageIndex);
  };

  return (
    <a
      className="underline"
      onClick={onClick}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      href={getPageLink(context.username, id)}
    >
      {children}
    </a>
  );
};
