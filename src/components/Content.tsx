import React, { ReactNode } from "react";

interface ContentProps {
  children?: ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => (
  <div id="content" className=" px-10 pb-6 flex-1 content-center">
    {children}
  </div>
);

export default Content;
