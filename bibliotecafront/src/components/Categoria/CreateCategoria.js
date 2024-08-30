import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const endpoint = `http://localhost:8000/api/categoria`;

const CreateCategoria = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const navigate = useNavigate();

  const create = async (e) => {
    e.preventDefault();
    await axios.post(endpoint, {
      nombre: nombre,
      descripción: descripcion,
    });
    navigate('/'); // Redirigir a la página principal o a donde desees después de la creación
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-11/12 h-2/5 text-xs bg-yellow-50 p-4 rounded-md shadow-md overflow-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">Crear Nueva Categoría</h3>

        <form onSubmit={create} className="grid grid-cols-1 gap-6">
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Descripción</label>
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
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
}

export default CreateCategoria;
