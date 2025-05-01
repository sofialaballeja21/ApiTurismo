import { useState, useEffect } from 'react';

const useGeolocation = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocalización no soportada por el navegador.');
            return;
        }

        const success = (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        };

        const failure = () => {
            setError('No se pudo obtener la ubicación.');
        };

        const watchId = navigator.geolocation.watchPosition(success, failure);

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return { latitude, longitude, error };
};

export default useGeolocation;