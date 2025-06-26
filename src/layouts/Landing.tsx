import React, { Suspense, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Main from "../components/Main";
import Wrapper from "../components/Wrapper";
import Content from "../components/Content";
import Loader from "../components/Loader";
import NavbarL from "../components/navbar/NavbarLanding";

interface DashboardProps {
  children?: ReactNode;
}

// HERE
const Default: React.FC<DashboardProps> = ({ children }) => (
  <React.Fragment>
    <Wrapper>
      <Main>
        <NavbarL/>
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

