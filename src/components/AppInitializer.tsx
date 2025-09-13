// client/src/components/AppInitializer.tsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 1. Importe o useLocation
import { useUserStore } from '../store/userStore';
import { Spinner } from "@radix-ui/themes";

const LoadingScreen = () => <div className="w-full h-screen flex justify-center items-center"><Spinner size="3" /></div>;

const PUBLIC_AUTH_PATHS = ['/google/login/callback'];

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
    const { checkSession, sessionChecked } = useUserStore();
    const location = useLocation(); // 3. Obtenha a localização atual

    useEffect(() => {
        const isPublicAuthPath = PUBLIC_AUTH_PATHS.some(path => location.pathname.startsWith(path));

        if (isPublicAuthPath) {
            useUserStore.setState({ sessionChecked: true });
            return;
        }

        if (!sessionChecked) {
            checkSession();
        }
    }, [checkSession, sessionChecked, location.pathname]); // 4. Adicione location.pathname às dependências

    if (!sessionChecked) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
};

export default AppInitializer;