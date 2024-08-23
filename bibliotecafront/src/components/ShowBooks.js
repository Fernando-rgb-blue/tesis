import React, { useEffect, useState } from 'react';
//import './css/styles.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const endpoint = 'http://localhost:8000/api';

const ShowBooks = () => {
  const [books, setBooks] = useState([]);
  const [autors, setAutors] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBooks();
    getAllAutors();
    getAllCategorias();
    getAllEditorials();
  }, [currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter((libro) =>
    libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    autors.find((autor) => autor.autorID === libro.autorID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categorias.find((categoria) => categoria.categoriaID === libro.categoriaID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const getAllBooks = async () => {
    try {
      const response = await axios.get(`${endpoint}/libros`, {
        params: {
          page: currentPage,
          limit: 10 // Ajusta el límite según tus necesidades
        }
      });
      console.log('API Response Data:', response.data);
      if (response.data && Array.isArray(response.data.data)) {
        setBooks(response.data.data);
        setTotalPages(response.data.last_page); // Total de páginas
      } else {
        console.error('Data received is not an array:', response.data);
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const getAllAutors = async () => {
    try {
      const response = await axios.get(`${endpoint}/autors`);
      setAutors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const getAllCategorias = async () => {
    try {
      const response = await axios.get(`${endpoint}/categorias`);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getAllEditorials = async () => {
    try {
      const response = await axios.get(`${endpoint}/editorials`);
      setEditorials(response.data);
    } catch (error) {
      console.error('Error fetching editorials:', error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${endpoint}/libro/${id}`);
      getAllBooks(); // Refetch books after deletion
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (

    <div className="w-11/12 mx-auto mt-8 small-text bg-yellow-50 p-4 rounded-md shadow-md"> {/* Fondo amarillo aplicado aquí */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion de Libros</h2>
        <Link to="/create" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
          Crear
        </Link>
      </div>

      {/* Cuadro de búsqueda con estilo */}

      <div className="mb-6 flex items-center bg-white rounded-md shadow-md p-2">
        <input
          type="text"
          placeholder="Ingrese el nombre del libro, autor o categoría"
          className="w-full p-2 text-gray-700 rounded-md focus:outline-none"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="ml-2 bg-black hover:bg-gray-800 text-white p-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19l-3.5-3.5m2-5.5A7.5 7.5 0 1116 4a7.5 7.5 0 010 15z" />
          </svg>
        </button>
      </div>


      <div className="overflow-x-auto rounded-md shadow-md">

        <div className="bg-yellow-50 shadow-md">

          <table className="min-w-full bg-yellow-50 border border-gray-800">

            <thead className="bg-gray-800 text-white ">
              <tr>
                <th className="py-2 px-3 border-b">ISBN</th>
                <th className="py-2 px-3 border-b">Código</th>
                <th className="py-2 px-3 border-b">Título</th>
                <th className="py-2 px-3 border-b">Autor</th>
                <th className="py-2 px-3 border-b">Categoría</th>
                <th className="py-2 px-3 border-b">Editorial</th>
                <th className="py-2 px-3 border-b">Año de Publicación</th>
                <th className="py-2 px-3 border-b">Ejemplares Disponibles</th>
                <th className="py-2 px-3 border-b">Edición</th>
                <th className="py-2 px-3 border-b">Número de Páginas</th>
                <th className="py-2 px-3 border-b">Estado</th>
                <th className="py-2 px-3 border-b">Acción</th>
              </tr>
            </thead>

            <tbody className='text-s'>

              {filteredBooks.map((libro) => (

                <tr key={libro.libroID} className="hover:bg-gray-100">

                  <td className="py-3 px-1 border-b break-word">{libro.isbn}</td>
                  <td className="py-3 px-4 border-b break-word">{libro.codigo}</td>
                  <td className="py-3 px-4 border-b break-word">{libro.titulo}</td>
                  <td className="py-3 px-4 border-b break-word">
                    {Array.isArray(autors) && autors.find((autor) => autor.autorID === libro.autorID)?.nombre || 'No disponible'}
                  </td>
                  <td className="py-3 px-4 border-b break-word">
                    {Array.isArray(categorias) && categorias.find((categoria) => categoria.categoriaID === libro.categoriaID)?.nombre || 'No disponible'}
                  </td>
                  <td className="py-3 px-4 border-b break-word">
                    {Array.isArray(editorials) && editorials.find((editorial) => editorial.editorialID === libro.editorialID)?.nombre || 'No disponible'}
                  </td>
                  <td className="py-3 px-4 border-b break-word">{libro.aniopublicacion}</td>
                  <td className="py-3 px-4 border-b break-word">{libro.ejemplaresdisponibles}</td>
                  <td className="py-3 px-4 border-b break-word">{libro.edicion}</td>
                  <td className="py-3 px-4 border-b break-word">{libro.numeropaginas}</td>
                  <td className="py-3 px-4 border-b break-word">{libro.estadolibro}</td>

                  <td className="py-3 px-4 border-b">
                    <Link to={`/edit/${libro.libroID}`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg mr-2 text-xs">
                      Editar
                    </Link>
                    <button onClick={() => deleteBook(libro.libroID)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-xs">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Anterior
        </button>
        <span className="flex items-center">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Siguiente
        </button>
      </div>
    </div>

  );
};

export default ShowBooks;
