import { ReactNode } from "react";

interface WrapperProps {
  children?: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => (
  <div id="wrapper" className=" flex items-stretch w-full">
    {children}
  </div>
);

export default Wrapper;
