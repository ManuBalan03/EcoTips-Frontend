// src/contexts/UserPointsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../api/AuthContext';
// import { obtenerUsuarioPorId  } from '../api/services/UserService';


interface UserPointsContextType {
  nivel:string;
  points: number;
  refreshPoints: () => Promise<void>;
}

const UserPointsContext = createContext<UserPointsContextType>({
  nivel:"nivel 0",
  points: 0,
  refreshPoints: async () => {}
});




export const useUserPoints = () => useContext(UserPointsContext);

export const UserPointsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [points, setPoints] = useState(0);
  const { token, user } = useAuth(); 
  const [nivel,setnivel ]= useState("nivel 0");
  

  const refreshPoints = async () => {
    if (!user?.id || !token) return;
  
    try {
      // const Usuario = await obtenerUsuarioPorId(user.id, token);
      const nuevosPuntos = user.puntosTotales|| 0
      const nuevonivel = user.nivel;
      
      // Solo actualiza si cambió el valor
      if (nuevosPuntos !== points) {
        setPoints(nuevosPuntos);
      }
      if(nuevonivel !==nivel  ){
        setnivel(nuevonivel);
      }
    } catch (error) {
      console.error("Error al actualizar puntos:", error);
    }
  };

  // Opcional: Actualizar puntos automáticamente al montar
  useEffect(() => {
    refreshPoints();
  }, [user?.id, token]);

  return (
    <UserPointsContext.Provider value={{ nivel,points, refreshPoints }}>
      {children}
    </UserPointsContext.Provider>
  );
};
