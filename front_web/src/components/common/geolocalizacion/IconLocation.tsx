import React from 'react'
import L from 'leaflet';
import Icon from '../../../assets/location.svg';



 export const IconLocation = L.icon ({
    iconUrl: Icon,
    iconSize: [32,32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]

});

