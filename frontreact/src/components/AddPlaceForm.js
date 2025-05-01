import React, { useState } from 'react';
import { addPlace } from '../services/api';

const AddPlaceForm = ({ onPlaceAdded }) => {
    const [nombre, setNombre] = useState('');
    const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');
    const [grupo, setGrupo] = useState('cervecerias'); 
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        console.log("handleSubmit se está ejecutando"); 
        e.preventDefault();
        if (!latitud || !longitud) {
            setError("Por favor, ingrese latitud y longitud.");
            return;
        }

        try {
            const response = await addPlace(grupo, nombre, parseFloat(latitud.trim()), parseFloat(longitud.trim()));
            console.log("Respuesta del backend:", response);
            if (response && response.mensaje) {
                onPlaceAdded(); 
                alert(response.mensaje);
                
                setNombre('');
                setLatitud(0);
                setLongitud(0);
                setError(null);
            } else if (response && response.error) {
                setError(response.error);
            } else {
                setError('Error al agregar el lugar');
            }
        } catch (error) {
            setError('Error al agregar el lugar.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Agregar Nuevo Lugar</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </label>
                <br />
                <label>
                    Latitud:
                    {/* Aquí debes reemplazar tu input de latitud actual */}
                    <input
                        type="number"
                        step="any"
                        value={latitud}
                        onChange={(e) => {
                            setLatitud(e.target.value);
                            console.log("Latitud:", e.target.value); 
                        }}
                        required
                    />
                </label>
                <br />
                <label>
                    Longitud:
                    
                    <input
                        type="number"
                        step="any"
                        value={longitud}
                        onChange={(e) => {
                            setLongitud(e.target.value);
                            console.log("Longitud:", e.target.value); 
                        }}
                        required
                    />
                </label>
                <br />
                <label>
                    Grupo:
                    <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                        <option value="cervecerias">Cervecerias</option>
                        <option value="universidades">Universidades</option>
                        <option value="farmacias">Farmacias</option>
                        <option value="supermercados">Supermercados</option>
                    </select>
                </label>
                <br />
                <button type="submit">Agregar Lugar</button>
            </form>
        </div>
    );
};

export default AddPlaceForm;
