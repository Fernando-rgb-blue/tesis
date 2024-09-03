import React, { useState } from 'react';
import axios from 'axios';

const endpoint = `http://localhost:8000/api/editorial`;

const CreateEditorial = ({ closeModal }) => {
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [error, setError] = useState('');

  const create = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar el error previo antes de hacer una nueva solicitud
    try {
      await axios.post(endpoint, {
        nombre,
        pais
      });
      closeModal(); // Cierra el modal después de crear la editorial
    } catch (error) {
      console.error('Error al crear la editorial:', error);
      setError('Hubo un error al crear la editorial. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md bg-yellow-50 p-4 rounded-md shadow-md">
        <button onClick={closeModal} className="absolute top-2 right-2 text-xl font-bold">
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center">Crear Nueva Editorial</h3>

        {/* Mostrar mensaje de error */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={create} className="grid grid-cols-1 gap-6">
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>País</label>
            <input
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div>
            <button type='submit' className='w-full py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors'>
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditorial;
