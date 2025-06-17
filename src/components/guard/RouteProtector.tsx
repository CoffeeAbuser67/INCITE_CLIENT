// src/components/RouteProtector.tsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { axiosForInterceptor } from "../../utils/axios";
import { useAuthService } from "../../hooks/useAuthService";

import { Spinner } from "@radix-ui/themes";

const LoadingScreen = () => <div className="w-full h-screen flex justify-center items-center"><Spinner size="3" /></div>;

export const RouteProtector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { user, sessionChecked, setActiveUser } = useUserStore();
    const { logout } = useAuthService(); // Pegamos o logout para limpar tudo


    useEffect(() => {
        if (user || sessionChecked) return;

        const fetchUser = async () => {
            try {
                const response = await axiosForInterceptor.get(`/auth/user/`);
                setActiveUser(response.data);
            } catch (error) {
                // O interceptor já tentou o refresh. Se ainda falhou, não há sessão válida.
                logout();
                // Não precisamos mostrar um toast de erro aqui, o redirecionamento é o feedback.
            }
        };

        fetchUser();
    }, [user, sessionChecked, setActiveUser, logout]);

    if (!sessionChecked) { return <LoadingScreen />;}

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};