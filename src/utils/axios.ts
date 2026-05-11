import axios from "axios";

// _PIN_ Nginx local proxy : 'http://127.0.0.1:81/api/v1';
// const BASE_URL = 'http://127.0.0.1:81/api/v1';

// _PIN_ Local Server : 'http://127.0.0.1:8000/api/v1';
const BASE_URL = "http://127.0.0.1:8000/api/v1";

// _PIN_ Production Server :
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;


// const BASE_URL = '/api/v1';


// Instancia axios criada para usar no Interceptor
export const axiosForInterceptor = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Instancia axios  pura
export const axiosPlain = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});



