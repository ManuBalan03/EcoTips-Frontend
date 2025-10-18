import { useEffect, useState } from "react";
import { CoordenadasDTO } from "../../types/CordenadasType"

export const useUbication = () => {
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Empieza en true
    const [hasRealUbication, setHasRealUbication] = useState(false);

    const [locationInfo, setLocationInfo] = useState<CoordenadasDTO>({
      latitud: 20.9674, // Mérida, Yucatán
      longitud: -89.5926
    });

    useEffect(() => {
      const solicitaUbicacion = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const accuracy = position.coords.accuracy;
              
              console.log('Ubicación obtenida:', { lat, lng, accuracy });
              
              // Si la precisión es mayor a 50km (50000 metros), usar ubicación por defecto
              if (accuracy > 50000) {
                console.warn('Precisión muy baja, usando ubicación por defecto de Mérida');
                setLocationError("Ubicación imprecisa, usando Mérida por defecto");
                setIsLoading(false);
                return;
              }
              
              setLocationInfo({
                latitud: lat,
                longitud: lng,
              });
              setHasRealUbication(true);
              setIsLoading(false);
            },
            (error) => {
              console.warn("No se pudo obtener ubicación, usando Mérida por defecto.", error);
              setLocationError("No se pudo obtener tu ubicación");
              setIsLoading(false);
            },
            { 
              enableHighAccuracy: true, 
              timeout: 10000, 
              maximumAge: 0 
            }
          );
        } else {
          setLocationError("Geolocalización no disponible");
          setIsLoading(false);
        }
      };

      solicitaUbicacion();
    }, []);

    return {
        locationInfo,
        locationError,
        isLoading,
        hasRealUbication
    };
};