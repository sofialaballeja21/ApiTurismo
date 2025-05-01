
import React, { useState, useCallback, useEffect } from 'react';
import useGeolocation from './hooks/useGeolocation';
import InterestGroupSelector from './components/InterestGroupSelector';
import NearbyPlacesList from './components/NearbyPlacesList';
import PlaceDetails from './components/PlaceDetails';
import AddPlaceForm from './components/AddPlaceForm';
import PlaceList from './components/PlaceList';
import ErrorMessage from './components/ErrorMessage';
import { getNearbyPlaces } from './services/api'; 

function App() {
  const { latitud, longitud, error: geolocationError } = useGeolocation();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
  const [error, setError] = useState(null);
  const [placesChanged, setPlacesChanged] = useState(false);
  const [userLocation, setUserLocation] = useState(null);


  const handleGroupChange = useCallback(async (group) => {
    console.log("handleGroupChange en App.js se ejecutó con el grupo:", group);
    setSelectedGroup(group);
    setNearbyPlaces([]);
    setSelectedPlaceDetails(null);
    setError(null);

    if (userLocation) {
      console.log("Ubicación del usuario:", userLocation);
      try {
        const data = await getNearbyPlaces(group, userLocation.latitude, userLocation.longitude);
        console.log("Respuesta de getNearbyPlaces:", data);
        setNearbyPlaces(data.lugares_cercanos);
      } catch (err) {
        setError('Error al cargar lugares.');
        console.error(err);
      }
    } else {
      console.log("Ubicación del usuario aún no disponible.");
    }
  }, [userLocation, getNearbyPlaces, setSelectedGroup, setNearbyPlaces, setSelectedPlaceDetails, setError]);


  useEffect(() => {
    if (latitud && longitud) {
      setUserLocation({ latitude: latitud, longitude: longitud });
      if (selectedGroup) {
        handleGroupChange(selectedGroup);
      }
    }
  }, [latitud, longitud, selectedGroup, handleGroupChange]);


  useEffect(() => {
    if (selectedGroup && userLocation && userLocation.latitude && userLocation.longitude) {
      handleGroupChange(selectedGroup);
    }
  }, [selectedGroup, userLocation, placesChanged, handleGroupChange]);

  const handlePlaceSelect = useCallback((place) => {
    setSelectedPlaceDetails(place);
  }, []);

  const handlePlaceAdded = useCallback(() => {
    setPlacesChanged(prev => !prev);
  }, []);

  return (
    <div>
      <h1>Api Turismo</h1>

      {geolocationError && <ErrorMessage message={`Error de geolocalización: ${geolocationError}`} />}

      <InterestGroupSelector onGroupChange={handleGroupChange} />

      {nearbyPlaces.length > 0 && (
        <NearbyPlacesList places={nearbyPlaces} onPlaceSelect={handlePlaceSelect} />
      )}

      {selectedPlaceDetails && (
        <PlaceDetails place={selectedPlaceDetails} userLocation={userLocation} />
      )}

      <AddPlaceForm onPlaceAdded={handlePlaceAdded} />

      <PlaceList /> 

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default App;