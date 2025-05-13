import axios, { AxiosInstance } from "axios";


// Definimos el tipo para las respuestas de la API
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}

// En Vite, usamos import.meta.env en lugar de process.env
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  auth: {
    username: 'admin',
    password: 'admin'
  },
  headers: {
    "Content-Type": "application/json"
  }
});

console.log("API URL:", import.meta.env.VITE_API_URL);


// Interceptor para manejar errores globalmente (opcional)
api.interceptors.response.use(
  (response): ApiResponse => response, // Tipo de la respuesta
  (error) => {
    // Aquí puedes manejar errores comunes como 401, 403, 500, etc.
    console.error("Error en la petición:", error);
    return Promise.reject(error);
  }
);

export default api;
