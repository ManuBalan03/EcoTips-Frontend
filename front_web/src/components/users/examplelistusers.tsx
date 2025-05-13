import React, { useState, useEffect } from 'react';
import { obtenerUsuarios } from '../../api/services/usersexample.ts';
import { Usuario } from '../../api/types/userexample.ts';
// Definir un tipo de Usuario si no lo tienes ya

function ListaUsuarios() {
  // Especificar que el estado es un arreglo de tipo Usuario
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);


  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);  // Especifica que el error puede ser un string o null

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setCargando(true);
        const data = await obtenerUsuarios();
    
        console.log("Datos obtenidos:", data); // <-- Verifica si es un array
    
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          console.error("La API no devolvió un array:", data);
          setUsuarios([]); // Evita errores si la API falla
        }
    
        setError(null);
      } catch (err) {
        setError("Error al cargar los usuarios");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    

    cargarUsuarios();
  }, []);

  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id}>
            {usuario.id} -{usuario.nombre}- {usuario.email}- {usuario.rol}
            </li>
          
        ))}
      </ul>
    </div>
  );
}

export default ListaUsuarios;
