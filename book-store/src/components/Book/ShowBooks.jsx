import React, { useEffect, useState, useMemo } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from '@nextui-org/react';
import EditBooks from './EditBooks';
import Swal from "sweetalert2";

const endpoint = 'http://localhost:8000/api';

const ShowBooks = () => {

  const [books, setBooks] = useState([]);
  const [autors, setAutors] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Estado para controlar el orden (A-Z o Z-A)
  const [categorias, setCategorias] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState('');
  const [limitFilter, setLimitFilter] = useState('');
  const [isModalOpen2, setIsModalOpen2] = useState(false);


  useEffect(() => {
    getAllBooks();
    getAllAutors();
    getAllCategorias();
    getAllEditorials();
    setPage(1); // Resetea la página cada vez que el filtro cambia
  }, []); // Solo ejecutamos una vez al cargar el componente

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reinicia la página al buscar
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

  const handleSortChange = (order) => {
    setSortOrder(order); // Actualiza el estado de orden
  };

  const handleUpdate = () => {
    // Refrescar la lista de libros después de la actualización
    console.log('Libro actualizado');
    getAllBooks(); // Llamar a getAllBooks para refrescar la lista después de actualizar
  };



  const handleDelete = async (id) => {
    // Mostrar la alerta de confirmación con SweetAlert2
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Realizar la solicitud para eliminar el libro
          await axios.delete(`${endpoint}/libro/${id}`);
          // Actualizar la lista de libros
          getAllBooks();
          // Mostrar mensaje de éxito
          Swal.fire("Eliminado", "El libro ha sido eliminado.", "success");
        } catch (error) {
          // Mostrar un mensaje de error si algo falla
          Swal.fire("Error", "Hubo un problema al intentar eliminar el libro.", "error");
          console.error("Error deleting book:", error);
        }
      }
    });
  };
  

  const rowsPerPage = 14;

  const handleExportWithoutFilter = () => {
    // Realiza la exportación sin aplicar los filtros de tiempo o cantidad
    const params = new URLSearchParams();
    window.location.href = `http://localhost:8000/api/booksexport?${params.toString()}`;
  };

  // Usamos useMemo para que solo se calcule cuando cambian los libros o la búsqueda
  const filteredBooks = useMemo(() => {
    return books.filter((libro) =>
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      autors.find((autor) => autor.autorID === libro.autorID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categorias.find((categoria) => categoria.categoriaID === libro.categoriaID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, autors, categorias, searchTerm]);

  // Asegura que `totalPages` sea al menos 1
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / rowsPerPage));

  const paginatedFilteredBooks = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredBooks.slice(start, end);
  }, [page, filteredBooks]);

  const openModal = (id) => {
    setSelectedBookId(id); // Almacenar el libroID en lugar del objeto completo
    setIsModalOpen(true);
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (timeFilter) params.append('time', timeFilter);
    if (limitFilter) params.append('limit', limitFilter);
    // Redirigir a la API con los filtros aplicados
    window.location.href = `http://localhost:8000/api/booksexport?${params.toString()}`;
  };

  return (
    <div className="flex flex-col items-center justify-center dark:bg-gray-900 mt-5">
      {/* Barra de búsqueda y Gestión de Libros */}
      <div className="w-11/12 text-xs dark:bg-gray-800 p-4 rounded-md shadow-md overflow-auto">
        {/* Título centrado */}
        <h1 className="text-2xl font-bold text-center dark:text-white mb-6">
          Gestión de Libros Generales
        </h1>

        <div className="flex justify-between items-center">
          {/* Input de búsqueda */}
          <div className="flex items-center w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 mr-4">
            <input
              type="text"
              placeholder="Ingrese el nombre del libro, autor o categoría"
              className="w-full p-2 text-gray-700 dark:text-gray-300 rounded-md focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Selector de orden */}
          <div className="flex-shrink-0 ml-4 w-32">
            <select
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg focus:outline-none"
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="asc">A - Z</option>
              <option value="desc">Z - A</option>
            </select>
          </div>

          {/* Botón + Añadir */}
          <div className="ml-4 w-32">
            <Link
              to="/create-books"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-center"
            >
              + Añadir
            </Link>
          </div>

          {/* Link Exportar con ícono de Excel */}
          <div>
            {/* Botón para abrir el modal */}
            <button
              onClick={() => setIsModalOpen2(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <i className="fas fa-file-excel mr-2"></i> Exportar
            </button>

            {/* Modal para los filtros */}

            {isModalOpen2 && (
              <div
                className="fixed inset-0 bg-gray-800  bg-opacity-50 z-50 flex justify-center items-center"
                style={{ zIndex: 1000 }} // Garantiza que esté encima de todo
              >
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96 relative">
                  <h2 className="text-lg font-bold mb-4">Filtros de Exportación</h2>

                  {/* Campo de filtro de tiempo */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Tiempo:</label>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Seleccionar</option>
                      <option value="30">Últimos 30 minutos</option>
                      <option value="60">Última 1 hora</option>
                    </select>
                  </div>

                  {/* Campo de límite */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Cantidad de libros:</label>
                    <input
                      type="number"
                      value={limitFilter}
                      onChange={(e) => setLimitFilter(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Ej: 10, 20, 30"
                    />
                  </div>

                  {/* Botones del modal */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsModalOpen2(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleExport}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Exportar
                    </button>
                    {/* Nuevo botón para exportar sin filtro */}
                    <button
                      onClick={handleExportWithoutFilter}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Exportar sin filtro
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="w-11/12 h-[600px] text-xs dark:bg-gray-800 p-2 rounded-md shadow-md overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
        <Table aria-label="Gestión de Libros" className="w-full table-fixed">
          <TableHeader>
            <TableColumn className="text-center font-semibold text-xs">ISBN</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Código</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Título</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Autor</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Categoría</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Editorial</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Año de Publicación</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Ejemplares Disponibles</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Acciones</TableColumn>
          </TableHeader>

          <TableBody>
            {paginatedFilteredBooks
              .sort((a, b) => (sortOrder === 'asc' ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo)))
              .map((libro) => (
                <TableRow key={libro.id}>
                  <TableCell className="text-center text-xs">{libro.isbn}</TableCell>
                  <TableCell className="text-center text-xs">{libro.codigolibroID}</TableCell>
                  <TableCell className="text-center text-xs">{libro.titulo}</TableCell>
                  <TableCell className="text-center text-xs">
                    {autors.find((autor) => autor.autorID === libro.autorID)?.nombre || "No disponible"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {categorias.find((categoria) => categoria.categoriaID === libro.categoriaID)?.nombre || "No disponible"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {editorials.find((editorial) => editorial.editorialID === libro.editorialID)?.nombre || "No disponible"}
                  </TableCell>
                  <TableCell className="text-center text-xs">{libro.aniopublicacion}</TableCell>
                  <TableCell className="text-center text-xs">{libro.ejemplaresdisponibles}</TableCell>
                  <TableCell className="text-center text-xs">
                    <div className="flex space-x-2 justify-center">
                      <Link
                        to={`/view-books/${libro.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-xs flex items-center justify-center"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <button
                        onClick={() => openModal(libro.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-lg text-xs flex items-center justify-center"
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>

                      {/* <button
                        onClick={() => deleteBook(libro.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg text-xs flex items-center justify-center"
                      >
                        <i className="fas fa-trash"></i>
                      </button> */}

                      <button
                        onClick={() => handleDelete(libro.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg text-xs flex items-center justify-center"
                      >
                        <i className="fas fa-trash"></i>
                      </button>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="w-11/12 text-xs dark:bg-gray-800 p-4 rounded-md shadow-md mt-4">
        <div className="flex w-full justify-center ">
          <Pagination
            isCompact
            showControls
            showShadow
            buttonClass="bg-blue-500 hover:bg-blue-600 text-white"
            total={totalPages}
            page={page}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
      {/* Modal de edición */}
      {isModalOpen && (
        <EditBooks
          libroID={selectedBookId}
          onUpdate={handleUpdate}
          onClose={() => setIsModalOpen(false)} // Pasar onClose como propiedad
        />
      )}
    </div>

  );

};
export default ShowBooks;
