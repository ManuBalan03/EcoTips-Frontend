import React, { useEffect, useState } from 'react'
import Narvbar from '../../layout/NavMainLayout';
import PuntoVerdeCard from '../geolocalizacion/PuntoVerdeCard';
import './Geolocalization.css';
import MapCard from '../geolocalizacion/MapCard';
import { PuntoVerdeDTO } from '../../../api/types/CordenadasType';
import { useUbication } from '../../../api/hooks/Geo/useUbication';
import { getPuntosVerde, puntoVerdeMasCercano } from '../../../api/services/UserServices/PuntosVerdeService';
import AgregarPunto from '../geolocalizacion/AgregarPunto';
import FormularioAgregar from '../geolocalizacion/FormularioAgregar';
import { useAuth } from '../../../api/AuthContext';


const Geolocalization = () => {
  const { token } = useAuth();
  const { locationInfo, isLoading, locationError } = useUbication();
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<PuntoVerdeDTO | null>(null);
  const [puntos, setPuntos]  = useState<PuntoVerdeDTO[]>([]);
  const [activeFormulario, setActiveFormulario] = useState(false);
  
  
  
  // Carga inicial de puntos y selección del más cercano
  useEffect(() => {
     // Solo hacer fetch si tenemos coordenadas y no está cargando
    if (!isLoading && locationInfo) {
      getPuntosVerde(token!)
        .then((data) => {
          setPuntos(data);
          const masCercano = puntoVerdeMasCercano(locationInfo, data);
          setPuntoSeleccionado(masCercano);
          
        })
        .catch(console.error);
    }
  }, [locationInfo, isLoading]);
  
    if(isLoading)  {
      return(
        <>
          
          <div className='alerta-contenedor'>
            <div className='alerta-container'>
              <div className='alerta-info'>
                    <h1>Necesitamos tu ubicación para mostrar los puntos cercanos. Por favor, actívala.  </h1>
              </div>
            </div>    
          </div>
        </>
      )
    } 
         


  return (
    <>
    
      <div className='geolocalization-conteiner'>
        <div className='content-container'>
          
          <div className='columna-izquierda'>
            <MapCard  puntos={puntos} 
              onMarkerClick={setPuntoSeleccionado} />
          </div>
          <div className='columna-derecha'>
              <PuntoVerdeCard  punto={puntoSeleccionado}/>
              <AgregarPunto mostrarForm = {setActiveFormulario}/>
          </div>
        </div> 
           {activeFormulario && <FormularioAgregar ocultarForm = {setActiveFormulario}/>} 
      </div>
     
    </>
    
    
  )
}

export default Geolocalization