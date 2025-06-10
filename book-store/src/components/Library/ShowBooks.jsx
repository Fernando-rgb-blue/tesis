import React, { useEffect, useState, useMemo } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input, Button } from "@heroui/react";

import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import { Select, SelectItem } from "@heroui/react";
import { FaFileExcel } from "react-icons/fa"; // asegúrate de tener react-icons instalado
import { PlusIcon } from "@heroicons/react/24/solid";

const endpoint = 'http://localhost:8000/api';
const ejemplarEndpoint = `http://localhost:8000/api/ejemplar/`;

const LibraryBooks = () => {

  const [books, setBooks] = useState([]);
  const [autors, setAutors] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Estado para controlar el orden (A-Z o Z-A)

  const [editorials, setEditorials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState('');
  const [limitFilter, setLimitFilter] = useState('');
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
  const [autoresConLibros, setAutoresConLibros] = useState([]);

  useEffect(() => {
    getAllBooks();
    getAllAutors();
    getAllEditorials();
    getAllBooksAutors();
    setPage(1); // Resetea la página cada vez que el filtro cambia
  }, []); // Solo ejecutamos una vez al cargar el componente

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reinicia la página al buscar
  };

  const loadAllData = async () => {
    await Promise.all([
      getAllBooks(),             // tu función para cargar libros
      getAllBooksAutors(),    // tu función para cargar autores con libros
      getAllEditorials(),        // si usas editoriales
    ]);
  };

  const getAllBooks = async () => {
    setLoading(true);

    try {
      // 1️⃣ Traemos todos los libros
      const { data: books } = await axios.get(`${endpoint}/libros2`);

      // 2️⃣ Para cada libro pedimos sus ejemplares en paralelo
      const librosConEjemplares = await Promise.all(
        books.map(async (libro) => {
          try {
            const { data: ejemplares } = await axios.get(
              `${ejemplarEndpoint}${libro.codigolibroID}`
            );
            return { ...libro, ejemplaresdisponibles: ejemplares.length };
          } catch {
            // Si falla la petición de ejemplares, devolvemos 0 para ese libro
            return { ...libro, ejemplaresdisponibles: 0 };
          }
        })
      );

      // 3️⃣ Guardamos el resultado (elige sólo uno de los dos states)
      setBooks(librosConEjemplares);     // <-- si tu UI consume "books"
      // setLibros(librosConEjemplares); // <-- si tu UI consume "libros"
    } catch (error) {
      console.error("Error fetching all books:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllBooksAutors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${endpoint}/autores-con-libros`);
      setAutoresConLibros(response.data.autores);
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

  const handleUpdate = async () => {
    setIsModalOpen(false);
    console.log('Libro actualizado');
    getAllBooks(); // Llamar a getAllBooks para refrescar la lista después de actualizar
    await loadAllData(); // recarga toda la información
  };

  const rowsPerPage = 14;

  // Usamos useMemo para que solo se calcule cuando cambian los libros o la búsqueda
  const filteredBooks = useMemo(() => {
    return books.filter((libro) =>
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      autors.find((autor) => autor.autorID === libro.autorID)?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, autors, searchTerm]);

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

    <div className="flex flex-col items-center justify-center dark:bg-stone-800 mt-5">

      {/* Barra de búsqueda y Gestión de Libros */}

      <div className="w-11/12 text-xs dark:bg-stone-900 p-4 rounded-md shadow-md mb-2.5">
        <h1 className="text-2xl font-bold text-center dark:text-white">
          Gestión de Libros Generales
        </h1>

        {/* Contenedor principal con flex en md y flex-col en móvil */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Input: ocupa todo en móvil y crece en pc */}
          <div className="w-full md:flex-1">
            <Input
              type="text"
              placeholder="Ingrese el nombre del libro, autor o categoría"
              className="w-full p-2 text-gray-700 dark:text-gray-300 rounded-md focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Contenedor de controles en móvil fila separada, en pc fila junto con input */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 w-full md:w-auto">
            {/* Selector de orden */}
            <div className="w-32 md:w-32">
              <Select
                aria-label="Ordenar por"
                selectedKeys={[sortOrder]}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full"
                size="sm"
                variant="flat"
              >
                <SelectItem key="asc" value="asc">A - Z</SelectItem>
                <SelectItem key="desc" value="desc">Z - A</SelectItem>
              </Select>
            </div>
          </div>
        </div>
      </div>





      {/* Tabla de resultados */}

      <div className="w-11/12 h-[600px] text-xs dark:bg-stone-900 p-4 rounded-md shadow-md overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
        <Table aria-label="Gestión de Libros" className="w-full table-fixed">
          <TableHeader>
            <TableColumn className="text-center font-semibold text-xs">Título</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Autor</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Editorial</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Fecha de Publicación</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Código</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Ejemplares Disponibles</TableColumn>
            <TableColumn className="text-center font-semibold text-xs">Acciones</TableColumn>
          </TableHeader>

          <TableBody>
            {paginatedFilteredBooks
              .filter((libro) => libro.habilitacion === 1) // Filtrar solo los libros habilitados
              .sort((a, b) =>
                sortOrder === 'asc'
                  ? a.titulo.localeCompare(b.titulo)
                  : b.titulo.localeCompare(a.titulo)
              )
              .map((libro) => (
                <TableRow key={libro.id}>
                  <TableCell className="text-center text-xs">{libro.titulo}</TableCell>

                  <TableCell className="text-center text-xs">
                    {autoresConLibros
                      .filter((autor) => autor.libros.some((l) => l.id === libro.id))
                      .map((autor) => autor.nombre)
                      .join(', ') || 'No disponible'}
                  </TableCell>

                  <TableCell className="text-center text-xs">
                    {editorials.find((editorial) => editorial.editorialID === libro.editorialID)?.nombre || 'No disponible'}
                  </TableCell>

                  <TableCell className="text-center text-xs">{libro.aniopublicacion}</TableCell>
                  <TableCell className="text-center text-xs">{libro.codigolibroID}</TableCell>
                  <TableCell className="text-center text-xs">{libro.ejemplaresdisponibles}</TableCell>

                  <TableCell className="text-center text-xs">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/library-book/${libro.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-xs flex items-center justify-center"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="w-11/12 text-xs dark:bg-stone-900 p-4 rounded-md shadow-md mt-4">
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


      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsModalOpen(false)} // clic fuera cierra
          >
          </motion.div>
        )}
      </AnimatePresence>


    </div>

  );

};
export default LibraryBooks;
