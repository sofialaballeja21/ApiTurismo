import React from 'react';

const NearbyPlacesList = ({ places, onPlaceSelect }) => {
    return (
        <div>
            <h2>Lugares Cercanos:</h2>
            {places.length === 0 ? (
                <p>No hay lugares cercanos.</p>
            ) : (
                <ul>
                    {places.map((place) => (
                        <li key={place.nombre} onClick={() => onPlaceSelect(place)}>
                            {place.nombre}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NearbyPlacesList;