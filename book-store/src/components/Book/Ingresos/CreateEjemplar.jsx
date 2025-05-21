import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "@heroui/react";
import { Alert, Button } from '@heroui/react';


const endpoint = 'http://localhost:8000/api/ejemplar';
const libroejemplar = 'http://localhost:8000/api/libro/';

const CreateEjemplar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { codigolibroID, ejemplaresdisponibles } = location.state || {};
  const [ejemplares, setEjemplares] = useState([]);
  const [error, setError] = useState('');
  const [cantidadEjemplares, setCantidadEjemplares] = useState(ejemplaresdisponibles);
  const [anioingreso, setAnioingreso] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);


  // Inicializamos los ejemplares con el número de ejemplares disponibles

  // 1. Para actualizar los ejemplares cuando cambia la cantidad
  useEffect(() => {
    if (cantidadEjemplares > 0) {
      setEjemplares(
        Array.from({ length: cantidadEjemplares }, () => ({
          ningresoID: '',
          anioingreso: '',
          estadolibro: '',
          precio: '',
          codigolibroID,
        }))
      );
    }
  }, [cantidadEjemplares, codigolibroID]);

  // 2. Para mostrar la alerta de éxito solo al cargar la página
  useEffect(() => {
    if (location.state?.showSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []); //  Solo se ejecuta una vez al montar



  const handleEjemplarChange = (index, e) => {
    const { name, value } = e.target;
    setEjemplares(prevEjemplares =>
      prevEjemplares.map((ejemplar, i) => i === index ? { ...ejemplar, [name]: value } : ejemplar)
    );
  };

  const handleCantidadChange = (e) => {
    const value = e.target.value;

    // Permitir campo vacío (mientras se edita)
    if (value === "") {
      setCantidadEjemplares("");
      return;
    }

    // Solo permitir números positivos y máximo 40
    if (/^\d+$/.test(value)) {
      const numericValue = Math.min(parseInt(value), 40);
      setCantidadEjemplares(numericValue.toString());
    }
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
    <>
      {/* Alerta de éxito condicional */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 z-50 w-fit max-w-md">
          <Alert
            color="success"
            className="flex items-center gap-4 px-4 py-3 shadow-lg rounded-md"
            title={
              <div className="flex items-center gap-2">
                <span className="text-green-700 dark:text-green-300 font-semibold">
                  Libro guardado exitosamente
                </span>
              </div>
            }
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}

      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-[110rem] mx-auto mt-20 overflow-y-auto max-h-[100vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

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
              max={40}
              isRequired
              aria-label="Cantidad de Ejemplares"
              className="w-full"
            />
          </div>

          <div className={`max-h-96 overflow-auto ${ejemplares.length > 3 ? 'scrollbar' : ''}`}>
            <div className="flex flex-col gap-4">
              {ejemplares.map((ejemplar, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 dark:bg-stone-800 p-4 rounded-lg"
                >
                  
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">
                      Control Topográfico {index + 1}
                    </label>
                    <Input
                      name="ningresoID"
                      value={ejemplar.ningresoID}
                      onChange={(e) => handleEjemplarChange(index, e)}
                      type="text"
                      className="w-full dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">
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
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">
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

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">
                      Año de Ingreso
                    </label>
                    <Input
                      name="anioingreso"
                      value={ejemplar.anioingreso}
                      onChange={(e) => handleEjemplarChange(index, e)}
                      type="date"
                      className="w-full dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              color="primary"
              className="font-semibold py-3 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transform transition duration-300 ease-in-out hover:scale-105"
            >
              Guardar Ejemplares
            </Button>
          </div>


        </form>
      </div>
    </>
  );

};

export default CreateEjemplar;
