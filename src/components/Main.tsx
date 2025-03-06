import React from "react";
import classNames from "classnames";

interface PropType {
  children: React.ReactNode;
}

const Main = ({ children }: PropType) => (
  <div
    id="main"
    className={classNames(
      "flex flex-col w-full min-h-screen min-w-0",
      "transition-all duration-500 ease-in-out",
      "sidebar-transition"
    )}
  >
    {children}
  </div>
);

export default Main;
