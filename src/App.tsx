import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

import { HelmetProvider, Helmet } from "react-helmet-async";
import routes from "./routes";
import Loader from "./components/Loader";

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setupAxiosInterceptor } from "./utils/axiosAuthInterceptor";
import { useAuthService } from "./hooks/useAuthService";


function App() {

  const content = useRoutes(routes); 
  const { logout } = useAuthService();
  setupAxiosInterceptor(logout);

  return (
    <HelmetProvider>
      <Helmet
        titleTemplate="%s 🔬 Instituto de Ciência, Inovação e Tecnologia do Estado da Bahia"
        defaultTitle="Agricultura Familiar Diversificada e Sustentável 🫘"
      />

      <Theme appearance="light" accentColor="bronze" grayColor="sand">
        <Suspense fallback={<Loader />}>{content}</Suspense>
      </Theme>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />


    </HelmetProvider>
  );
}

export default App;
