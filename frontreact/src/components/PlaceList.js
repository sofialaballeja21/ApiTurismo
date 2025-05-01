import React, { useState, useEffect } from 'react';

const PlaceList = () => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; 

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    setPlaces([]);
    setError(null);
  };

  useEffect(() => {
    const fetchAllPlaces = async () => {
      if (selectedGroup) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/grupos/${selectedGroup}/listadolugares`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPlaces(data.lugares || []);
        } catch (err) {
          setError('Error al cargar la lista de lugares.');
          console.error(err);
        }
      }
    };

    fetchAllPlaces();
  }, [selectedGroup, API_BASE_URL]);

  return (
    <div>
      <h2>Lista de Lugares por Grupo</h2>
      <div>
        <label htmlFor="groupSelector">Seleccionar Grupo:</label>
        <select id="groupSelector" value={selectedGroup} onChange={handleGroupChange}>
          <option value="">Seleccionar...</option>
          <option value="cervecerias">Cervecerías</option>
          <option value="universidades">Universidades</option>
          <option value="farmacias">Farmacias</option>
          <option value="supermercados">Supermercados</option>
        
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedGroup && places.length > 0 && (
        <ul>
          {places.map((place) => (
            <li key={place.nombre}>
              {place.nombre} - Latitud: {place.latitud}, Longitud: {place.longitud}
            </li>
          ))}
        </ul>
      )}

      {selectedGroup && places.length === 0 && !error && (
        <p>No hay lugares registrados para el grupo seleccionado.</p>
      )}
    </div>
  );
};

export default PlaceList;