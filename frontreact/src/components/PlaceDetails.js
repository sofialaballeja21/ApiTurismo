import React, { useState, useEffect } from 'react';
import { getDistance } from '../services/api'; 

const PlaceDetails = ({ place, userLocation }) => {
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (place && userLocation) {
            const fetchDistance = async () => {
                try {
                    const calculatedDistance = await getDistance(
                        'cervecerias', 
                        place.nombre,
                        userLocation.latitude,
                        userLocation.longitude
                    );
                    setDistance(calculatedDistance.distancia_km);
                } catch (err) {
                    setError('Error al calcular la distancia.');
                    console.error(err);
                }
            };

            fetchDistance();
        }
    }, [place, userLocation]);

    if (!place) {
        return <div>Selecciona un lugar para ver los detalles.</div>;
    }

    return (
        <div>
            <h2>Detalles del Lugar:</h2>
            <p>Nombre: {place.nombre}</p>
            <p>Latitud: {place.latitud}</p>
            <p>Longitud: {place.longitud}</p>
            {distance !== null && <p>Distancia: {distance.toFixed(2)} km</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default PlaceDetails;