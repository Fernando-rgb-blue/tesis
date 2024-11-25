import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@nextui-org/react';

const endpoint = 'http://159.65.183.18:8000/api/libro/';

const EditBooks = ({ libroID, onClose, onUpdate }) => {
  const [isbn, setIsbn] = useState('');
  const [codigolibroID, setCodigoLibroID] = useState('');
  const [titulo, setTitulo] = useState('');
  const [title, setTitle] = useState('');
  const [autorID, setAutorID] = useState('');
  const [categoriaID, setCategoriaID] = useState('');
  const [editorialID, setEditorialID] = useState('');
  const [aniopublicacion, setAniopublicacion] = useState('');
  const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
  const [edicion, setEdicion] = useState('');
  const [numeropaginas, setNumeropaginas] = useState('');
  const [volumen, setVolumen] = useState('');
  const [tomo, setTomo] = useState('');
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getBookById = async () => {
      const response = await axios.get(`${endpoint}${libroID}`);
      const bookData = response.data;

      // Asignar datos del libro
      setIsbn(bookData.isbn);
      setCodigoLibroID(bookData.codigolibroID);
      setTitulo(bookData.titulo);
      setTitle(bookData.titulo);
      setAutorID(bookData.autorID);
      setCategoriaID(bookData.categoriaID);
      setEditorialID(bookData.editorialID);
      setAniopublicacion(bookData.aniopublicacion);
      setEjemplaresdisponibles(bookData.ejemplaresdisponibles);
      setEdicion(bookData.edicion);
      setNumeropaginas(bookData.numeropaginas);
      setVolumen(bookData.volumen);
      setTomo(bookData.tomo);

      // Obtener listas de opciones
      const autoresResponse = await axios.get('http://159.65.183.18:8000/api/autors');
      setAutores(autoresResponse.data);

      const categoriasResponse = await axios.get('http://159.65.183.18:8000/api/categorias');
      setCategorias(categoriasResponse.data);

      const editorialesResponse = await axios.get('http://159.65.183.18:8000/api/editorials');
      setEditoriales(editorialesResponse.data);
    };
    getBookById();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${endpoint}${libroID}`, {
        isbn,
        codigolibroID,
        titulo,
        autor_nombre: autorID,
        categoria_nombre: categoriaID,
        editorial_nombre: editorialID,
        aniopublicacion,
        ejemplaresdisponibles,
        edicion,
        numeropaginas,
        volumen,
        tomo,
      });
      onUpdate(); // Actualiza la lista de libros después de editar
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose(); // Cierra el modal si se presiona Esc
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Limpia el evento al desmontar
    };
  }, [onClose]);



    

  return (
    <div
      className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Cierra al hacer clic fuera del contenedor
    >
      <div
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-3xl w-full relative scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre el contenedor
      >
        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ❌
        </button>
  
        <h2 className="text-2xl font-bold mb-4 text-center"> Editar Libro: {title} </h2>
  
        <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Inputs del formulario */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">ISBN</label>
            <Input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              type="text"
              isRequired
              aria-label="ISBN"
              className="w-full"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Código
            </label>
            <Input
              value={codigolibroID}
              onChange={(e) => setCodigoLibroID(e.target.value)}
              type="text"
              isRequired
              aria-label="Código"
              className="w-full"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Título
            </label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              type="text"
              isRequired
              aria-label="Título"
              className="w-full"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Autor
            </label>
  
            <select
              value={autorID}
              onChange={(e) => setAutorID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {autores.map((autor) => (
                <option key={autor.id} value={autor.id}>
                  {autor.nombre}
                </option>
              ))}
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Categoría
            </label>
            <select
              value={categoriaID}
              onChange={(e) => setCategoriaID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Editorial
            </label>
            <select
              value={editorialID}
              onChange={(e) => setEditorialID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {editoriales.map((editorial) => (
                <option key={editorial.id} value={editorial.id}>
                  {editorial.nombre}
                </option>
              ))}
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Año de Publicación
            </label>
            <Input
              value={aniopublicacion}
              onChange={(e) => setAniopublicacion(e.target.value)}
              type="text"
              isRequired
              aria-label="Año de Publicación"
              className="w-full"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Ejemplares Disponibles
            </label>
            <Input
              value={ejemplaresdisponibles}
              onChange={(e) => setEjemplaresdisponibles(e.target.value)}
              type="text"
              isRequired
              aria-label="Ejemplares Disponibles"
              className="w-full"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Edición
            </label>
            <Input
              value={edicion}
              onChange={(e) => setEdicion(e.target.value)}
              type="text"
              isRequired
              aria-label="Edición"
              className="w-full"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Número de Páginas
            </label>
            <Input
              value={numeropaginas}
              onChange={(e) => setNumeropaginas(e.target.value)}
              type="text"
              isRequired
              aria-label="Número de Páginas"
              className="w-full"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Volumen
            </label>
            <Input
              value={volumen}
              onChange={(e) => setVolumen(e.target.value)}
              type="text"
              isRequired
              aria-label="Volumen"
              className="w-full"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Tomo
            </label>
            <Input
              value={tomo}
              onChange={(e) => setTomo(e.target.value)}
              type="text"
              isRequired
              aria-label="Tomo"
              className="w-full"
            />
          </div>
  
          {/* Botones de acción */}
          <div className="col-span-full flex justify-center gap-4 mt-6">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md"
              onClick={onClose} // Botón para cancelar
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-md"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  

};

export default EditBooks;