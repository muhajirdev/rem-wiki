import { useContext } from "react";
import { getPageLink } from "../utils/navigation";
import { StackContext } from "./stack-context";

export const DocumentLink = ({ id, children }) => {
  const context = useContext(StackContext);

  const onClick = (e) => {
    e.preventDefault();
    context.navigateToNewPage(id, context.pageIndex);
  };

  return (
    <a
      className="underline"
      onClick={onClick}
      href={getPageLink(context.username, id)}
    >
      {children}
    </a>
  );
};
