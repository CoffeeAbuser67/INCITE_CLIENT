import React, { Suspense, ReactNode } from "react";
import { Outlet } from "react-router-dom";

import Main from "../components/Main";
import Wrapper from "../components/Wrapper";
import Content from "../components/Content";
import Loader from "../components/Loader";

interface AuthProps {
  children?: ReactNode;
}

// HERE
const Auth: React.FC<AuthProps> = ({ children }) => (
  <React.Fragment>
    <Wrapper>
      <Main>
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

export default Auth;
