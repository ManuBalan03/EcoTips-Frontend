import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

// Sistema de deduplicación
const pendingRequests = new Map();

const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  return `${config.method?.toUpperCase()}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`;
};

// Interceptor de request CORREGIDO - aplicar a la instancia 'api'
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestKey = generateRequestKey(config);
    
    // Verificar si ya hay una request idéntica en curso
    if (pendingRequests.has(requestKey)) {
      console.log(`🔄 Evitando duplicado: ${config.method?.toUpperCase()} ${config.url}`);
      return pendingRequests.get(requestKey);
    }

    const requestPromise = Promise.resolve(config);
    pendingRequests.set(requestKey, requestPromise);

    // Debug logging
    const stack = new Error().stack;
    console.group(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('📤 Request:', config);
    console.log('🧭 Called from:', stack);
    console.groupEnd();

    // Limpiar después de resolver
    requestPromise.finally(() => {
      setTimeout(() => {
        pendingRequests.delete(requestKey);
      }, 100); // Pequeño delay para evitar race conditions
    });

    return requestPromise;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response CORREGIDO - aplicar a la instancia 'api'
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestKey = generateRequestKey(response.config);
    console.log(`✅ API Success: ${response.config.url} ${response.status}`);
    return response;
  },
  (error) => {
    const requestKey = generateRequestKey(error.config);
    console.error(`❌ API Error: ${error.config?.url}`, error.response?.status || error.message);
    return Promise.reject(error);
  }
);

export default api;