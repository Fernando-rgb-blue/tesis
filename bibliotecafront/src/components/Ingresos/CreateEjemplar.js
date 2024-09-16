// CreateEjemplar.js
import React, { useState } from 'react';
import axios from 'axios';

const endpoint = 'http://localhost:8000/api/ejemplar';

const CreateEjemplar = ({ codigolibroID, closeModal }) => {
  const [cantidad, setCantidad] = useState(0);
  const [ejemplares, setEjemplares] = useState([]);
  const [error, setError] = useState('');

  const handleCantidadChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setCantidad(count);
    setEjemplares(Array.from({ length: count }, () => ({ ningresoID: '', estadolibro: '', codigolibroID })));
  };

  const handleEjemplarChange = (index, e) => {
    const { name, value } = e.target;
    setEjemplares(prevEjemplares => 
      prevEjemplares.map((ejemplar, i) => i === index ? { ...ejemplar, [name]: value } : ejemplar)
    );
  };

  const saveEjemplares = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await Promise.all(ejemplares.map(ejemplar => 
        axios.post(endpoint, ejemplar)
      ));
      closeModal(); // Cierra el modal después de la operación
    } catch (error) {
      console.error('Error al guardar ejemplares:', error);
      setError('Hubo un error al guardar los ejemplares. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md bg-yellow-50 p-4 rounded-md shadow-md">
        <button onClick={closeModal} className="absolute top-2 right-2 text-xl font-bold">
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center">Crear Nuevos Ejemplares</h3>

        {/* Mostrar mensaje de error */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={saveEjemplares} className="grid grid-cols-1 gap-6">
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Cantidad de Ejemplares</label>
            <input
              type='number'
              value={cantidad}
              onChange={handleCantidadChange}
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              min='1'
              required
            />
          </div>

          <div>
            {ejemplares.map((ejemplar, index) => (
              <div key={index} className='flex flex-col'>
                <label className='mb-2 text-sm font-medium text-gray-700'>Número de Ingreso {index + 1}</label>
                <input
                  name='ningresoID'
                  value={ejemplar.ningresoID}
                  onChange={(e) => handleEjemplarChange(index, e)}
                  type='text'
                  className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  required
                />
                <label className='mt-4 mb-2 text-sm font-medium text-gray-700'>Estado del Libro {index + 1}</label>
                <input
                  name='estadolibro'
                  value={ejemplar.estadolibro}
                  onChange={(e) => handleEjemplarChange(index, e)}
                  type='text'
                  className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <button type='submit' className='w-full py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors'>
              Guardar Ejemplares
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEjemplar;
