// InterestGroupSelector.js
import React from 'react';

const InterestGroupSelector = ({ onGroupChange }) => {
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    console.log("Grupo de interés seleccionado:", selectedValue);
    onGroupChange(selectedValue);
  };

  return (
    <div>
      <label htmlFor="interestGroup">Seleccionar Grupo de Interés:</label>
      <select id="interestGroup" onChange={handleSelectChange}>
        <option value="">Seleccionar...</option>
        <option value="cervecerias">Cervecerías</option>
        <option value="universidades">Universidades</option>
        <option value="farmacias">Farmacias</option>
        <option value="supermercados">Supermercados</option>
      </select>
    </div>
  );
};

export default InterestGroupSelector;