import axios from 'axios';
import {PuntoVerdeDTO} from '../../types/CordenadasType';
import { CoordenadasDTO } from '../../types/CordenadasType';


const BASE_URL = 'http://localhost:8080/api/PuntoVerde';
// const username = 'admin';
// const password = 'holabola';


// const credentials = btoa(`${username}:${password}`);

export const getPuntosVerde = async ( token: string): Promise<PuntoVerdeDTO[]> => {
   try{
    const response = await axios.get<PuntoVerdeDTO[]>(BASE_URL, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
   } catch(e){
    console.log("Error al obtener puntos verdes",e)
    return[];
   }
  
};

export const puntoVerdeMasCercano = (coordenada : CoordenadasDTO, puntoVerde : PuntoVerdeDTO[]) =>{
  const distancia= (posicionUsuario :CoordenadasDTO, posicionPunto : CoordenadasDTO) => {
    return Math.sqrt(Math.pow(posicionUsuario.latitud - posicionPunto.latitud,2)+ Math.pow(posicionUsuario.longitud - posicionPunto.longitud,2));

  }
    console.log("Mi coordenada:", coordenada);
  console.log("Puntos verdes:", puntoVerde);
  // reduce es una funcion que recorre un arreglo en este caso de puntosVerdes para poder comparar cual es el mas cercano y ejecuta la funcion de distancia 
  //anteriormente creada la cual hace la funcion de distancia entre dos puntos la cual devuelve la distancia entre el usuario y los puntos
  // seguido evalua cada uno de eso resultados con la comparacion si la distancia actual es menor que la previa se queda con la actual si no se queda con la previa 
  return puntoVerde.reduce((previo , actual) => 
    distancia(coordenada, actual) < distancia(coordenada, previo) ? actual : previo
  );
}


export const postPuntoVerde = async(punto : PuntoVerdeDTO):Promise<PuntoVerdeDTO[]> => {
  const token = localStorage.getItem("token");

  try{
    const response= await axios.post(`${BASE_URL}/insertPV`, punto, {
   withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
  }catch(e){
    console.log("Error al registrar el punto verde",e);
    return[]
  }
  
}

