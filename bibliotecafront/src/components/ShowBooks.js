import React, { useEffect, useState } from 'react';
import './css/styles.css';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBooks();
    getAllAutors();
    getAllCategorias();
    getAllEditorials();
  }, [currentPage]);

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
    <div className="w-11/12 mx-auto mt-8 small-text"> {/* Aplica small-text aquí */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lista de Libros</h2>
        <Link to="/create" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
          Crear
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 fixed-table">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 border-b">ISBN</th>
              <th className="py-3 px-4 border-b">Código</th>
              <th className="py-3 px-4 border-b">Título</th>
              <th className="py-3 px-4 border-b">Autor</th>
              <th className="py-3 px-4 border-b">Categoría</th>
              <th className="py-3 px-4 border-b">Editorial</th>
              <th className="py-3 px-4 border-b">Año de Publicación</th>
              <th className="py-3 px-4 border-b">Ejemplares Disponibles</th>
              <th className="py-3 px-4 border-b">Edición</th>
              <th className="py-3 px-4 border-b">Número de Páginas</th>
              <th className="py-3 px-4 border-b">Estado</th>
              <th className="py-3 px-4 border-b">Acción</th>
            </tr>
          </thead>

          <tbody>
            {books.map((libro) => (
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
