import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const endpoint = `http://159.65.183.18:8000/api/libro/`;
const ejemplarEndpoint = `http://159.65.183.18:8000/api/ejemplar/`;

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
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-6 w-full h-screen">
            <div className="w-full max-w-screen-2xl h-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg overflow-auto">
                <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
                    {titulo}
                </h3>

                {/* Contenedor General */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Columna 1: Imagen del libro */}

                    <div className="flex justify-center items-center">
                        <img
                            src="https://www.penguinlibros.com/mx/4394455-large_default/harry-potter-y-la-camara-secreta-harry-potter-2.webp"
                            alt="Imagen del libro"
                            className="w-full max-w-md h-auto object-contain rounded-lg shadow-md"
                        />
                    </div>


                    {/* Columna 2: Datos del libro y tabla */}
                    <div className="flex flex-col">
                        {/* Datos del libro */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">ISBN:</span> {isbn}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Código:</span> {codigolibroID}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Título:</span> {titulo}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Autor:</span> {autorID}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Categoría:</span> {categoriaID}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Editorial:</span> {editorialID}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Año de Publicación:</span> {aniopublicacion}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Ejemplares Disponibles:</span> {ejemplaresdisponibles}
                                </p>
                            </div>
                        </div>

                        {/* Tabla de ejemplares */}
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-md overflow-auto">
                            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                                <thead className="bg-gray-200 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-2">N. Ingreso</th>
                                        <th className="px-4 py-2">Estado del Libro</th>
                                        <th className="px-4 py-2 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ejemplares.map((ejemplar, index) => (
                                        <tr key={index} className="border-b dark:border-gray-600">
                                            <td className="px-4 py-2">{ejemplar.ningresoID}</td>
                                            <td className="px-4 py-2">{ejemplar.estadolibro}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
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









