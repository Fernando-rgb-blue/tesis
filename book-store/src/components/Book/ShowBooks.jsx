import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const endpoint = 'http://localhost:8000/api';

const ShowBooks = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]); // Para almacenar todos los libros
  const [autors, setAutors] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBooks();       // Libros con paginación
    getAllAutors();
    getAllCategorias();
    getAllEditorials();
    getAllBooks2();      // Todos los libros para filtrar
  }, [currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getAllBooks = async () => {
    try {
      const response = await axios.get(`${endpoint}/libros`, {
        params: {
          page: currentPage,
          limit: 8 // Ajusta el límite según tus necesidades
        }
      });
      console.log('API Response Data (Paginated):', response.data);
      if (response.data && Array.isArray(response.data.data)) {
        setBooks(response.data.data);
        setTotalPages(response.data.last_page); // Total de páginas
      } else {
        console.error('Data received is not an array:', response.data);
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books (paginated):', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const getAllBooks2 = async () => {
    try {
      const response = await axios.get(`${endpoint}/libros2`);
      setAllBooks(response.data); // Todos los libros para filtrar
    } catch (error) {
      console.error('Error fetching all books for filtering:', error);
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
        getAllBooks2(); // Refetch books after deletion
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Filtra los libros basándose en el término de búsqueda
  const filteredBooks = allBooks.filter((libro) =>
    libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    autors.find((autor) => autor.autorID === libro.autorID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categorias.find((categoria) => categoria.categoriaID === libro.categoriaID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagina los resultados filtrados
  const paginatedFilteredBooks = filteredBooks.slice((currentPage - 1) * 8, currentPage * 8);


  
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Sección 1: Barra de búsqueda y Gestión de Libros */}
      <div className="w-11/12 text-xs bg-yellow-50 p-4 rounded-md shadow-md mb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Gestión de Libros</h2>
          <Link to="/create" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
            Crear
          </Link>
        </div>
  
        <div className="mb-6 flex items-center bg-white rounded-md shadow-md p-2">
          <input
            type="text"
            placeholder="Ingrese el nombre del libro, autor o categoría"
            className="w-full p-2 text-gray-700 rounded-md focus:outline-none"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
  
      {/* Sección 2: Tabla de resultados con scroll */}
      <div className="w-11/12 flex-grow text-xs bg-yellow-50 p-4 rounded-md shadow-md overflow-auto">
        <div className="overflow-x-auto rounded-md shadow-md">
          <table className="min-w-full bg-yellow-50 border border-gray-800">
            <thead className="bg-gray-800 text-white">
              <tr>
                {/* Columnas */}
                <th className="py-2 px-3 border-b">ISBN</th>
                <th className="py-2 px-3 border-b">Código</th>
                <th className="py-2 px-3 border-b">Título</th>
                <th className="py-2 px-3 border-b">Autor</th>
                <th className="py-2 px-3 border-b">Categoría</th>
                <th className="py-2 px-3 border-b">Editorial</th>
                <th className="py-2 px-3 border-b">Año de Publicación</th>
                <th className="py-2 px-3 border-b">Ejemplares Disponibles</th>
                <th className="py-2 px-3 border-b">Número de Páginas</th>
                <th className="py-2 px-3 border-b">Edición</th>
                <th className="py-2 px-3 border-b">Volumen</th>
                <th className="py-2 px-3 border-b">Tomo</th>
                <th className="py-2 px-3 border-b">Acción</th>
              </tr>
            </thead>
            <tbody className="text-s">
              {paginatedFilteredBooks.map((libro) => (
                <tr key={libro.libroID} className="hover:bg-gray-100">
                  <td className="py-3 px-1 border-b break-word text-center">{libro.isbn}</td>
                  <td className="py-3 px-4 border-b break-word text-center">{libro.codigolibroID}</td>
                  <td className="py-3 px-4 border-b break-word text-center">{libro.titulo}</td>
                  <td className="py-3 px-4 border-b break-word text-center">
                    {Array.isArray(autors) && autors.find((autor) => autor.autorID === libro.autorID)?.nombre || 'No disponible'}
                  </td>
                  <td className="py-3 px-4 border-b break-word text-center">
                    {Array.isArray(categorias) && categorias.find((categoria) => categoria.categoriaID === libro.categoriaID)?.nombre || 'No disponible'}
                  </td>
                  <td className="py-3 px-4 border-b break-word text-center">
                    {Array.isArray(editorials) && editorials.find((editorial) => editorial.editorialID === libro.editorialID)?.nombre || 'No disponible'}
                  </td>
                  <td className="py-3 px-4 border-b break-word text-center">{libro.aniopublicacion}</td>
                  <td className="py-3 px-4 border-b break-word text-center">{libro.ejemplaresdisponibles}</td>
                  <td className="py-3 px-4 border-b break-word text-center">{libro.numeropaginas}</td>
                  <td className="py-3 px-4 border-b break-word text-center">{libro.edicion}</td>
                  <td className="py-3 px-4 border-b break-word text-center">{libro.volumen}</td>
                  <td className="py-3 px-4 border-b break-word text-center">{libro.tomo}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <Link to={`/view/${libro.codigolibroID}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center">
                        <i className="fas fa-eye"></i>
                      </Link>
  
                      <Link to={`/edit/${libro.codigolibroID}`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center">
                        <i className="fas fa-pencil-alt"></i>
                      </Link>
  
                      <button onClick={() => deleteBook(libro.codigolibroID)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Sección 3: Botones de paginación */}
      <div className="w-11/12 text-xs bg-yellow-50 p-4 rounded-md shadow-md mt-4">
        <div className="flex justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-black text-white font-bold py-2 px-4 rounded-lg"
          >
            Anterior
          </button>
          <span className="flex items-center">Página {currentPage} de {Math.ceil(filteredBooks.length / 8)}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredBooks.length / 8)}
            className="bg-black text-white font-bold py-2 px-4 rounded-lg"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
  


};

export default ShowBooks;
