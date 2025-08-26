// src/contexts/UserPointsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../api/AuthContext';
import { obtenerUsuarioPorId  } from '../api/services/UserService';


interface UserPointsContextType {
  points: number;
  refreshPoints: () => Promise<void>;
}

const UserPointsContext = createContext<UserPointsContextType>({
  points: 0,
  refreshPoints: async () => {}
});




export const useUserPoints = () => useContext(UserPointsContext);

export const UserPointsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [points, setPoints] = useState(0);
  const { token, user } = useAuth(); 

  const refreshPoints = async () => {
    if (!user?.id || !token) return;
  
    try {
      const Usuario = await obtenerUsuarioPorId(user.id, token);
      const nuevosPuntos = Usuario.puntosTotales || 0;
      
      // Solo actualiza si cambió el valor
      if (nuevosPuntos !== points) {
        setPoints(nuevosPuntos);
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
    <UserPointsContext.Provider value={{ points, refreshPoints }}>
      {children}
    </UserPointsContext.Provider>
  );
};
