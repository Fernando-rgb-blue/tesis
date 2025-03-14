import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import { Input } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { Textarea } from "@heroui/react";

const endpoint = 'http://localhost:8000/api/libro/';

const EditBooks = ({ libroID, onClose, onUpdate }) => {

  const [isbn, setIsbn] = useState('');
  const [controltopografico, setControltopografico] = useState('');
  const [codigolibroID, setCodigoLibroID] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autorID, setAutorID] = useState('');
  const [numeropaginas, setNumeropaginas] = useState('');
  const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
  const [resumen, setResumen] = useState('');
  const [volumen, setVolumen] = useState('');
  const [tomo, setTomo] = useState('');
  const [categoriaID, setCategoriaID] = useState('');
  const [edicion, setEdicion] = useState('');
  const [editorialID, setEditorialID] = useState('');
  const [pais, setPais] = useState('');
  const [idioma, setIdioma] = useState('');
  const [aniopublicacion, setAniopublicacion] = useState('');
  const [formadeadquisicion, setFormadeadquisicion] = useState('');
  const [precio, setPrecio] = useState('');
  const [procedenciaproovedor, setProcedenciaproovedor] = useState('');
  const [rutafoto, setRutafoto] = useState(null); // Estado para el archivo
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [fechaadquisicion, setFechaadquisicion] = useState(null);

  const { id } = useParams();

  useEffect(() => {

    const getBookById = async () => {

      const response = await axios.get(`${endpoint}${libroID}`);
      const bookData = response.data;

      setIsbn(bookData.isbn);
      setControltopografico(bookData.controltopografico);
      setCodigoLibroID(bookData.codigolibroID);
      setTitulo(bookData.titulo);
      setAutorID(bookData.autorID);
      setNumeropaginas(bookData.numeropaginas);
      setEjemplaresdisponibles(bookData.ejemplaresdisponibles);
      setResumen(bookData.resumen);
      setVolumen(bookData.volumen);
      setTomo(bookData.tomo);
      setCategoriaID(bookData.categoriaID);
      setEdicion(bookData.edicion);
      setEditorialID(bookData.editorialID);
      setPais(bookData.pais);
      setIdioma(bookData.idioma);
      setAniopublicacion(bookData.aniopublicacion);
      setFormadeadquisicion(bookData.formadeadquisicion);
      setPrecio(bookData.precio);
      setProcedenciaproovedor(bookData.procedenciaproovedor);
      setFechaadquisicion(bookData.fechaadquisicion);

      const autoresResponse = await axios.get('http://localhost:8000/api/autors');
      setAutores(autoresResponse.data);

      const categoriasResponse = await axios.get('http://localhost:8000/api/categorias');
      setCategorias(categoriasResponse.data);

      const editorialesResponse = await axios.get('http://localhost:8000/api/editorials');
      setEditoriales(editorialesResponse.data);
    };
    getBookById();
  }, [id]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append('_method', 'PUT'); // Método HTTP PUT simulado con POST

      formData.append('isbn', isbn);
      formData.append('controltopografico', controltopografico);
      formData.append('codigolibroID', codigolibroID);
      formData.append('titulo', titulo);
      formData.append('numeropaginas', numeropaginas);
      formData.append('ejemplaresdisponibles', ejemplaresdisponibles);
      formData.append('resumen', resumen);
      formData.append('volumen', volumen);
      formData.append('tomo', tomo);
      formData.append('edicion', edicion);
      formData.append('pais', pais);
      formData.append('idioma', idioma);
      formData.append('aniopublicacion', aniopublicacion);
      formData.append('formadeadquisicion', formadeadquisicion);
      formData.append('precio', precio);
      formData.append('procedenciaproovedor', procedenciaproovedor);
      formData.append('autor_nombre', autorID);
      formData.append('categoria_nombre', categoriaID);
      formData.append('editorial_nombre', editorialID);
      formData.append('fechaadquisicion', fechaadquisicion);

      if (rutafoto) {
        formData.append('rutafoto', rutafoto); // Agregar imagen solo si está presente
      }

      // Enviar la solicitud al backend
      const response = await axios.post(`${endpoint}${libroID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Book updated successfully:', response.data);

      // Mostrar alerta de éxito con SweetAlert2
      Swal.fire({
        title: 'Actualización exitosa',
        text: 'El libro se ha actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      onUpdate(); // Actualizar la lista de libros
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error updating book:', error.response?.data || error.message);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el libro.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };



  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

  }, [onClose]);


  return (
    <div
      className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Cierra al hacer clic fuera del contenedor
    >
      <div
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-5xl w-full relative scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 overflow-y-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre el contenedor
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ❌
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Editar Libro: {titulo}</h2>

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

        <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Inputs del formulario */}

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100">ISBN</label>
            <Input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              type="text"
              isRequired
              aria-label="ISBN"
              className="w-full"
            />
          </div>

          {/* Autor */}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
              Autor
            </label>
            <div className="flex items-center gap-2">
              <Autocomplete
                aria-label="Seleccionar Autor"
                placeholder="Buscar Autor..."
                selectedKey={autorID} // Usa el nombre del autor como clave seleccionada
                onSelectionChange={(key) => {
                  // key es el nombre del autor seleccionado
                  console.log('Nombre del autor seleccionado:', key);
                  setAutorID(key); // Guarda el nombre del autor en el estado
                }}
                className="w-full"
                popoverProps={{ className: "bg-white" }}
              >
                {autores.map((autor) => (
                  <AutocompleteItem key={autor.nombre} textValue={autor.nombre}>
                    {autor.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>


          {/* Categoría */}

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Categoría
            </label>
            <div className="flex items-center">
              <Autocomplete
                aria-label="Seleccionar Categoría"
                placeholder="Buscar Categoría..."
                selectedKey={categoriaID} // Usa el nombre de la categoría como clave seleccionada
                onSelectionChange={(key) => {
                  // key es el nombre de la categoría seleccionada
                  console.log('Nombre de la categoría seleccionada:', key);
                  setCategoriaID(key); // Guarda el nombre de la categoría en el estado
                }}
                className="w-full"
                popoverProps={{ className: "bg-white" }}
              >
                {categorias.map((categoria) => (
                  <AutocompleteItem key={categoria.nombre} textValue={categoria.nombre}>
                    {categoria.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>

          {/* Editorial */}

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Editorial
            </label>
            <div className="flex items-center">
              <Autocomplete
                aria-label="Seleccionar Editorial"
                placeholder="Buscar Editorial..."
                selectedKey={editorialID} // Usa el nombre de la editorial como clave seleccionada
                onSelectionChange={(key) => {
                  // key es el nombre de la editorial seleccionada
                  console.log('Nombre de la editorial seleccionada:', key);
                  setEditorialID(key); // Guarda el nombre de la editorial en el estado
                }}
                className="w-full"
                popoverProps={{ className: "bg-white" }}
              >
                {editoriales.map((editorial) => (
                  <AutocompleteItem key={editorial.nombre} textValue={editorial.nombre}>
                    {editorial.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>


          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Control Topográfico</label>
            <Input
              value={controltopografico}
              onChange={(e) => setControltopografico(e.target.value)}
              type="text"
              aria-label="Control Topográfico"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Código</label>
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
            <label className="mb-2 text-sm font-medium text-gray-700">Volumen</label>
            <Input
              value={volumen}
              onChange={(e) => setVolumen(e.target.value)}
              type="text"
              aria-label="Volumen"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Tomo</label>
            <Input
              value={tomo}
              onChange={(e) => setTomo(e.target.value)}
              type="text"
              aria-label="Tomo"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Fecha de Adquisición
            </label>
            <Input
              value={fechaadquisicion}
              onChange={(e) => setFechaadquisicion(e.target.value)}
              type="date" // Cambio de tipo a "date"
              aria-label="Fecha De Adquisición"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Pais</label>
            <Input
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              type="text"
              aria-label="Pais"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Idioma</label>
            <Input
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              type="text"
              aria-label="Idioma"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Forma de Adquisición</label>
            <Input
              value={formadeadquisicion}
              onChange={(e) => setFormadeadquisicion(e.target.value)}
              type="text"
              aria-label="Forma de Adquisición"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Precio</label>
            <Input
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              type="text"
              aria-label="Precio"
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
            <label className="mb-2 text-sm font-medium text-gray-700">Procedencia del Proveedor</label>
            <Input
              value={procedenciaproovedor}
              onChange={(e) => setProcedenciaproovedor(e.target.value)}
              type="text"
              aria-label="Procedencia del Proveedor"
              className="w-full"
            />
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

          {/* Columna para el resumen */}
          <div className="flex flex-col w-full">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Resumen
            </label>
            <Textarea
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              aria-label="Resumen"
              rows={6}
              className="w-full"
            />
          </div>

          <Input type="file" label="Imagen" onChange={(e) => setRutafoto(e.target.files[0])} />

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
              onClick={handleUpdate}
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


