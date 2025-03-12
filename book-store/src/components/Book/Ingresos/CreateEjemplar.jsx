import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@nextui-org/react';

const endpoint = 'http://localhost:8000/api/ejemplar';
const libroejemplar = 'http://localhost:8000/api/libro/';

const CreateEjemplar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { codigolibroID, ejemplaresdisponibles } = location.state || {};
  const [ejemplares, setEjemplares] = useState([]);
  const [error, setError] = useState('');
  const [cantidadEjemplares, setCantidadEjemplares] = useState(ejemplaresdisponibles);

  // Inicializamos los ejemplares con el número de ejemplares disponibles

  useEffect(() => {
    if (cantidadEjemplares) {
      setEjemplares(Array.from({ length: cantidadEjemplares }, () => ({ ningresoID: '', estadolibro: '', estadolibro: '', codigolibroID })));
    }
  }, [cantidadEjemplares, codigolibroID]);

  const handleEjemplarChange = (index, e) => {
    const { name, value } = e.target;
    setEjemplares(prevEjemplares =>
      prevEjemplares.map((ejemplar, i) => i === index ? { ...ejemplar, [name]: value } : ejemplar)
    );
  };

  const handleCantidadChange = (e) => {
    const newCantidad = Math.max(0, parseInt(e.target.value) || 0);
    setCantidadEjemplares(newCantidad);
  };

  const saveEjemplares = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Guardar los ejemplares
      await Promise.all(ejemplares.map(ejemplar =>
        axios.post(endpoint, ejemplar)
      ));

      const data = { ejemplaresdisponibles: cantidadEjemplares };

      // Usamos PUT para actualizar el número de ejemplares disponibles con JSON
      const response = await axios.put(`${libroejemplar}${codigolibroID}`, data, {
        headers: {
          'Content-Type': 'application/json', // Cambiado a JSON
        },
      });
      console.log('Book updated successfully:', response.data);

      navigate('/show-books');
    } catch (error) {
      console.error('Error al guardar ejemplares:', error);
      setError('Hubo un error al guardar los ejemplares. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="h-[calc(100vh-88px)] flex items-center justify-center bg-gray-200 dark:bg-black">
      <div className="w-11/12 md:w-3/4 lg:w-2/3 h-auto md:h-4/5 text-xs bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-lg overflow-hidden">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          Crear Nuevos Ejemplares - Código del libro: {codigolibroID || 'N/A'}
        </h3>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={saveEjemplares} className="space-y-6">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Cantidad de Ejemplares:
            </label>
            <Input
              value={cantidadEjemplares}
              onChange={handleCantidadChange}
              type="number"
              isRequired
              aria-label="Cantidad de Ejemplares"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Ejemplares Disponibles
            </label>
            <Input
              value={cantidadEjemplares}
              type="text"
              isRequired
              aria-label="Ejemplares Disponibles"
              className="w-full"
              disabled
            />
          </div>

          {/* Container con Scroll si hay más de 3 ejemplares */}
          <div className={`max-h-96 overflow-auto ${ejemplares.length > 3 ? 'scrollbar' : ''}`}>
            {ejemplares.map((ejemplar, index) => (
              <div key={index} className="flex flex-col mb-6">
                <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                  Número de Ingreso {index + 1}
                </label>
                <Input
                  name="ningresoID"
                  value={ejemplar.ningresoID}
                  onChange={(e) => handleEjemplarChange(index, e)}
                  type="text"
                  className="w-full dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  required
                />

                <label className="mt-4 mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                  Estado del Libro {index + 1}
                </label>
                <Input
                  name="estadolibro"
                  value={ejemplar.estadolibro}
                  onChange={(e) => handleEjemplarChange(index, e)}
                  type="text"
                  className="w-full dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  required
                />

                <label className="mt-4 mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                  Precio {index + 1}
                </label>
                <Input
                  name="precio"
                  value={ejemplar.precio}
                  onChange={(e) => handleEjemplarChange(index, e)}
                  type="text"
                  className="w-full dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition duration-300 ease-in-out hover:scale-105"
            >
              Guardar Ejemplares
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};

export default CreateEjemplar;
