import React, { useState } from 'react';
import axios from 'axios';

const endpoint = `http://159.65.183.18:8000/api/categoria`; // Asegúrate de que esta URL sea correcta

const CreateCategoria = ({ closeModal }) => {
  const [nombre, setNombre] = useState('');
  const [descripción, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const create = async (e) => {
    e.preventDefault();
    try {
      await axios.post(endpoint, {
        nombre,
        descripción
      });
      closeModal(); // Cierra el modal después de crear la categoría
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      setError('Hubo un error al crear la categoría. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md bg-yellow-50 dark:bg-gray-800 p-4 rounded-md shadow-md">

        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-xl font-bold bg-yellow-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full p-2 shadow-md hover:bg-yellow-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-gray-500"
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Crear Nueva Categoría</h3>

        {/* Mostrar mensaje de error */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={create} className="grid grid-cols-1 gap-6">
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-100'>Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-100'>Descripción</label>
            <input
              value={descripción}
              onChange={(e) => setDescripcion(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
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

export default CreateCategoria;
