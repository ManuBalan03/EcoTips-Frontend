import React from "react";
import "./PuntoVerdeCard.css";
import { PuntoVerdeDTO } from "../../../api/types/CordenadasType"

interface PuntoVerdeCardProps {
  punto: PuntoVerdeDTO | null;  // Acepta null para el estado inicial
}
const PuntoVerdeCard: React.FC<PuntoVerdeCardProps > =({punto})=> {
   
    if (!punto) {
    return (
      <div className="container-punto-card">
        <div className="sin-seleccion">
          <p>Selecciona un punto verde en el mapa o espera a que cargue el más cercano...</p>
        </div>
      </div>
    );
    }

    return(
    <div className="container-punto-card">
        <div className="nombre-punto">
            <span className="nombre"><b>{punto.nombre}</b></span>
        </div>
        <div className="imagen-punto">
            <img alt="imagen punto verde" src={punto.imagen_url}/>
        </div>
        <div className="punto-information">
            <span> <b>Descripcion: </b>{punto.descripcion}</span>
            <span> <b>Direccion: </b>{punto.direccion}</span>
            <span> <b>Categoria: </b>{punto.tipo_residuo}</span>
        </div>
        
    </div>

    );
}
export default PuntoVerdeCard;