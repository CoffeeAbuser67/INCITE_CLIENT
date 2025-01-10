// HERE RouteProtector
import { useLocation, Navigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useEffect, useState } from "react";

import useAxiosErrorInterceptor from "../../hooks/useAxiosErrorInterceptor";
import handleAxiosError from "../../utils/handleAxiosError";

import Loader from "../Loader";

interface PropType {
  allowedRoles: number[];
  children: React.ReactNode;
}

const CustomLoader = () => (
  <div id="custom_loader" className="relative h-screen">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Loader />
    </div>
  </div>
);



// ★ RouteProtector  ⋙── ── ── ── ── ── ── ──➤
const RouteProtector: React.FC<PropType> = ({ allowedRoles, children }) => {

  const location = useLocation();
  const axios = useAxiosErrorInterceptor();
  const user = useUserStore((state) => state.user);
  const user_role = useUserStore((state) => state.user_role);
  const setUserRole = useUserStore((state) => state.setUserRole);


  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    // Avoid fetching user role if there is no user
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`/auth/userRole/`);
        const group_id = response?.data?.id;
        setUserRole(group_id);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user, axios, setUserRole]);

  // If still loading, show the loader
  if (isLoading) {
    return <CustomLoader />;
  }

  // No user or invalid role, redirect to home
  if (!user || !user_role || !allowedRoles.includes(user_role)) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }


  // If the user role matches, render the children
  return <>{children}</>;
};

export default RouteProtector;
