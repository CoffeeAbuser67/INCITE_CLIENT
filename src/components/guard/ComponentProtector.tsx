import React from 'react';

import { useUserStore } from "../../store/userStore";


interface GuardProps {
  allowedRoles: number[];
  children: React.ReactNode;
}

// ✪ ComponentProtector
const ComponentProtector: React.FC<GuardProps>  = ({allowedRoles, children}) => {
  const user_role = useUserStore((state) => state.user_role);


  return(
    <>
      {
        !user_role 
          ? <></> 
          : allowedRoles.includes(user_role) 
            ? <>{children}</> 
            : <></> 
      }
    </>
  )

};


export default ComponentProtector