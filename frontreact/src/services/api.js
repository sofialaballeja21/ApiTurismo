
const API_BASE_URL = 'http://localhost:5000';

export const getNearbyPlaces = async (group, latitude, longitude) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/grupos/${group}/cercanos?lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                console.log("Respuesta completa del backend:", data);
                return data; 
            });

        console.log("Datos procesados para mostrar:", data);
        return data;

    } catch (error) {
        console.error("Error al obtener lugares cercanos:", error);
        throw error; 
    }
};



export const getDistance = async (group, placeName, userLatitude, userLongitude) => {
    
    
    try {
        const response = await fetch (
            `{API_BASE_URL}/api/grupos/${group}/lugares?punto=${encodeURIComponent(placeName)}&lat_usuario=${userLatitude}&lon_usuario=${userLongitude}`

        );
        if (!response.ok) {
            throw new Error('Error al obtener la distancia');
        
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const addPlace = async (group, nombre, latitud, longitud) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/grupos/${group}/lugares`, {  // Corregido
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, latitud, longitud }),
        });

        if (!response.ok) {
            try {
                
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al agregar lugar');
            } catch (jsonError) {
                const errorText = await response.text();
                throw new Error(`Error al agregar lugar (no se pudo parsear JSON de error): ${errorText}`);
            }
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

