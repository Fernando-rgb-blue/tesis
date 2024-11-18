import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const endpoint = `http://localhost:8000/api/libro/`;
const ejemplarEndpoint = `http://localhost:8000/api/ejemplar/`;

const ViewBook = () => {
  const [isbn, setIsbn] = useState('');
  const [codigolibroID, setCodigoLibroID] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autorID, setAutorID] = useState('');
  const [categoriaID, setCategoriaID] = useState('');
  const [editorialID, setEditorialID] = useState('');
  const [aniopublicacion, setAniopublicacion] = useState('');
  const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
  const [edicion, setEdicion] = useState('');
  const [numeropaginas, setNumeropaginas] = useState('');
  const [volumen, setVolumen] = useState('');
  const [tomo, setTomo] = useState('');
  const [ejemplares, setEjemplares] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(`${endpoint}${id}`);
        const bookData = response.data;

        setIsbn(bookData.isbn);
        setCodigoLibroID(bookData.codigolibroID);
        setTitulo(bookData.titulo);
        setAutorID(bookData.autorID);
        setCategoriaID(bookData.categoriaID);
        setEditorialID(bookData.editorialID);
        setAniopublicacion(bookData.aniopublicacion);
        setEjemplaresdisponibles(bookData.ejemplaresdisponibles);
        setEdicion(bookData.edicion);
        setNumeropaginas(bookData.numeropaginas);
        setVolumen(bookData.volumen);
        setTomo(bookData.tomo);

        // Fetch ejemplares based on codigolibroID
        const ejemplarResponse = await axios.get(`${ejemplarEndpoint}${bookData.codigolibroID}`);
        setEjemplares(ejemplarResponse.data);
      } catch (error) {
        console.error('Error fetching book or ejemplar data:', error);
      }
    };

    fetchBookData();
  }, [id]);

  return (
    <div className="flex items-center justify-center bg-gray-200 dark:bg-black py-6 w-full h-screen">
      <div className="w-full max-w-screen-2xl h-full bg-yellow-50 dark:bg-gray-900 p-6 rounded-md shadow-md">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">{titulo}</h3>

        {/* Contenedor General con 2 columnas */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Columna 1: Imagen del libro */}
          <div className="flex justify-center items-center">
            <img 
              src="https://www.penguinlibros.com/mx/4394455-large_default/harry-potter-y-la-camara-secreta-harry-potter-2.webp" 
              alt="Imagen del libro"
              className="w-full max-w-full h-auto max-h-[500px] object-contain rounded-md shadow-md"
            />
          </div>

          {/* Columna 2: Datos del libro y tabla */}
          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Datos del libro */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">ISBN: {isbn}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Código: {codigolibroID}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Título: {titulo}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Autor: {autorID}</label>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Categoría: {categoriaID}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Editorial: {editorialID}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Año de Publicación: {aniopublicacion}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Ejemplares Disponibles: {ejemplaresdisponibles}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Edición: {edicion}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Número de Páginas: {numeropaginas}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Volumen: {volumen}</label>
                <label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-100">Tomo: {tomo}</label>
              </div>
            </div>

            {/* Tabla de ejemplares */}
            <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-md mt-4 p-4 overflow-auto">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-2">N. Ingreso</th>
                    <th className="px-4 py-2">Estado del Libro</th>
                    <th className="px-4 py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ejemplares.map((ejemplar, index) => (
                    <tr key={index} className="border-b dark:border-gray-600">
                      <td className="px-4 py-2">{ejemplar.ningresoID}</td>
                      <td className="px-4 py-2">{ejemplar.estadolibro}</td>
                      <td className="px-4 py-2">
                        <button className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">
                          Préstamo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBook;
