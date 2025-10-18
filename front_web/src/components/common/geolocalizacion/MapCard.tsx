import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap } from "react-leaflet"; 
import { useUbication } from '../../../api/hooks/Geo/useUbication';
import { Marker, Popup } from 'react-leaflet';
import { IconLocation } from './IconLocation';
import { getPuntosVerde, puntoVerdeMasCercano } from '../../../api/services/UserServices/PuntosVerdeService';
import { PuntoVerdeDTO } from '../../../api/types/CordenadasType';
import "leaflet/dist/leaflet.css";

import '../geolocalizacion/MapCard.css'

interface MapCardProps {
  puntos: PuntoVerdeDTO[];
  onMarkerClick: (punto: PuntoVerdeDTO) => void;
}

const MapCard: React.FC<MapCardProps> = ({ puntos, onMarkerClick }) => {
  const { locationInfo, locationError, isLoading } = useUbication();

  const ChangeMapView = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(coords, map.getZoom());
    }, [coords[0], coords[1], map]); // Escucha cambios en latitud y longitud
    return null;
  };

  const descripcion = "Un centro de reciclaje ubicado en una zona urbana que recibe y procesa residuos reciclables. Su objetivo es reducir la contaminación y promover la reutilización de materiales";

  if (isLoading) {
    return <div>Cargando ubicación...</div>;  
  }
  
  return (
    <div className='map-card-container'>
      <span className='centros'><b>Centros de reciclaje cerca de tí</b></span>
      <div className='map-view-container'>
        <MapContainer
          center={[locationInfo.latitud, locationInfo.longitud]}
          zoom={14}
          zoomControl={false}
          style={{ height: '400px', width: '100%' }}
        >
          <ChangeMapView coords={[locationInfo.latitud, locationInfo.longitud]} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {puntos.map((punto, index) => (
            <Marker
              key={punto.id ?? index}
              position={[punto.latitud, punto.longitud]}
              icon={IconLocation}
              eventHandlers={{ click: () => onMarkerClick(punto) }}
            >
              <Popup>{punto.nombre}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className='punto-information'>
        <span><b>Descripcion: </b>{descripcion}</span>
      </div>
    </div>
  )
}

export default MapCard