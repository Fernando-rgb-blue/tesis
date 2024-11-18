import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const endpoint = 'http://localhost:8000/api';

const ShowBooks = () => {
  const [books, setBooks] = useState([]);
  const [autors, setAutors] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10; // Cantidad de elementos por página

  useEffect(() => {
    getAllBooks();
    getAllAutors();
    getAllCategorias();
    getAllEditorials();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reiniciar a la primera página en caso de buscar
  };

  const getAllBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${endpoint}/libros2`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching all books:', error);
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
    const confirmed = window.confirm('¿Está seguro de que desea eliminar este libro?');
    if (confirmed) {
      try {
        await axios.delete(`${endpoint}/libro/${id}`);
        getAllBooks(); // Refetch books after deletion
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(filteredBooks.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  // Filtra y pagina los libros basándose en el término de búsqueda
  const filteredBooks = books.filter((libro) =>
    libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    autors.find((autor) => autor.autorID === libro.autorID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categorias.find((categoria) => categoria.categoriaID === libro.categoriaID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFilteredBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Crear un arreglo con los números de página
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);


  return (

    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Barra de búsqueda y Gestión de Libros */}
      <div className="w-11/12 text-xs bg-yellow-50 dark:bg-gray-800 p-4 rounded-md shadow-md mb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Gestión de Libros</h2>
          <Link to="/create-books" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
            Crear
          </Link>
        </div>

        <div className="mb-6 flex items-center bg-white dark:bg-gray-700 rounded-md shadow-md p-2">
          <input
            type="text"
            placeholder="Ingrese el nombre del libro, autor o categoría"
            className="w-full p-2 text-gray-700 dark:text-gray-300 rounded-md focus:outline-none"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="w-11/12 h-[600px] text-xs bg-yellow-50 dark:bg-gray-800 p-4 rounded-md shadow-md overflow-auto">
        <table className="min-w-full bg-yellow-50 dark:bg-gray-800">

          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="py-2 px-3 rounded-tl-md">ISBN</th>
              <th className="py-2 px-3">Código</th>
              <th className="py-2 px-3">Título</th>
              <th className="py-2 px-3">Autor</th>
              <th className="py-2 px-3">Categoría</th>
              <th className="py-2 px-3">Editorial</th>
              <th className="py-2 px-3">Año de Publicación</th>
              <th className="py-2 px-3">Ejemplares Disponibles</th>
              <th className="py-2 px-3">Número de Páginas</th>
              <th className="py-2 px-3 rounded-tr-md">Acción</th>
            </tr>
          </thead>

          <tbody>
            {paginatedFilteredBooks.map((libro) => (
              <tr key={libro.libroID} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-3 px-1 text-center">{libro.isbn}</td>
                <td className="py-3 px-4 text-center">{libro.codigolibroID}</td>
                <td className="py-3 px-4 text-center">{libro.titulo}</td>
                <td className="py-3 px-4 text-center">
                  {autors.find((autor) => autor.autorID === libro.autorID)?.nombre || 'No disponible'}
                </td>
                <td className="py-3 px-4 text-center">
                  {categorias.find((categoria) => categoria.categoriaID === libro.categoriaID)?.nombre || 'No disponible'}
                </td>
                <td className="py-3 px-4 text-center">
                  {editorials.find((editorial) => editorial.editorialID === libro.editorialID)?.nombre || 'No disponible'}
                </td>
                <td className="py-3 px-4 text-center">{libro.aniopublicacion}</td>
                <td className="py-3 px-4 text-center">{libro.ejemplaresdisponibles}</td>
                <td className="py-3 px-4 text-center">{libro.numeropaginas}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex space-x-2">
                    <Link to={`/view-books/${libro.id}`} className="bg-green-500 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center">
                      <i className="fas fa-eye"></i>
                    </Link>
                    <Link to={`/edit-books/${libro.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center">
                      <i className="fas fa-pencil-alt"></i>
                    </Link>
                    <button onClick={() => deleteBook(libro.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}


      <div className="w-11/12 text-xs bg-yellow-50 dark:bg-gray-800 p-4 rounded-md shadow-md mt-4">
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded"
          >
            {"<"}
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${currentPage === number ? 'bg-blue-700 text-white' : ''}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded"
          >
            {">"}
          </button>
        </div>
      </div>


    </div>



  );

};

export default ShowBooks;
