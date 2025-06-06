import React, { Suspense, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Main from "../components/Main";
import Wrapper from "../components/Wrapper";
import Content from "../components/Content";
import Loader from "../components/Loader";

import Navbar from "../components/navbar/Navbar";
import Navbar2 from "../components/navbar/Navbar2";


interface DashboardProps {
  children?: ReactNode;
}

// HERE
const Default: React.FC<DashboardProps> = ({ children }) => (
  <React.Fragment>
    <Wrapper>
      <Main>
        <Navbar2/>
        <Content>
          <Suspense fallback={<Loader />}>
            {children}
            <Outlet />
          </Suspense>
        </Content>
      </Main>
    </Wrapper>
  </React.Fragment>
);

export default Default;
