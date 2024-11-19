import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 

const endpoint = 'http://159.65.183.18:8000/api/ejemplar';

const CreateEjemplar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { codigolibroID, ejemplaresdisponibles } = location.state || {}; 
  
  const [ejemplares, setEjemplares] = useState([]);
  const [error, setError] = useState('');

  // Inicializamos los ejemplares con el número de ejemplares disponibles
  useEffect(() => {
    if (ejemplaresdisponibles) {
      setEjemplares(Array.from({ length: ejemplaresdisponibles }, () => ({ ningresoID: '', estadolibro: '', codigolibroID })));
    }
  }, [ejemplaresdisponibles, codigolibroID]);

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
      // Itera sobre los ejemplares y guarda cada uno
      await Promise.all(ejemplares.map(ejemplar => 
        axios.post(endpoint, ejemplar)
      ));
      navigate('/');  
    } catch (error) {
      console.error('Error al guardar ejemplares:', error);
      setError('Hubo un error al guardar los ejemplares. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="w-full max-w-md bg-yellow-50 p-4 rounded-md shadow-md mx-auto mt-8">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Crear Nuevos Ejemplares - Código del libro: {codigolibroID || 'N/A'}
      </h3>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={saveEjemplares} className="grid grid-cols-1 gap-6">
        <div className='flex flex-col'>
          <label className='mb-2 text-sm font-medium text-gray-700'>
            Cantidad de Ejemplares: {ejemplaresdisponibles}
          </label>
        </div>

        {/* Container con Scroll si hay más de 3 ejemplares */}
        <div className={`max-h-96 overflow-y-auto ${ejemplares.length > 3 ? 'scrollbar' : ''}`}>
          {ejemplares.map((ejemplar, index) => (
            <div key={index} className='flex flex-col mb-4'>
              <label className='mb-2 text-sm font-medium text-gray-700'>
                Número de Ingreso {index + 1}
              </label>
              <input
                name='ningresoID'
                value={ejemplar.ningresoID}
                onChange={(e) => handleEjemplarChange(index, e)}
                type='text'
                className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                required
              />
              <label className='mt-4 mb-2 text-sm font-medium text-gray-700'>
                Estado del Libro {index + 1}
              </label>
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
  );
};

export default CreateEjemplar;
