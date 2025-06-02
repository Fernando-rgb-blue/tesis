import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import { Input, Button, Textarea, Select, SelectItem } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { motion } from "framer-motion";

const endpoint = 'http://localhost:8000/api/libro/';
const ejemplarEndpoint = `http://localhost:8000/api/ejemplar/`;

const EditBooks = ({ libroID, onClose, onUpdate }) => {
  const [isbn, setIsbn] = useState('');
  const [codigolibroID, setCodigoLibroID] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autorID, setAutorID] = useState('');
  const [selectedAutores, setSelectedAutores] = useState([]);
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
  const [procedenciaproovedor, setProcedenciaproovedor] = useState('');
  const [ejemplares, setEjemplares] = useState([]);
  const [rutafoto, setRutafoto] = useState(null);
  // const [fechaadquisicion, setFechaadquisicion] = useState(null);
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getBookById = async () => {
      const response = await axios.get(`${endpoint}${libroID}`);
      const bookData = response.data;
      setIsbn(bookData.isbn);
      setCodigoLibroID(bookData.codigolibroID);
      setTitulo(bookData.titulo);
      setAutorID(bookData.autorID);
      setNumeropaginas(bookData.numeropaginas);
      //setEjemplaresdisponibles(bookData.ejemplaresdisponibles);
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
      setProcedenciaproovedor(bookData.procedenciaproovedor);
      // setFechaadquisicion(bookData.fechaadquisicion);

      const autoresRes = await axios.get('http://localhost:8000/api/autors');
      setAutores(autoresRes.data);

      const categoriasRes = await axios.get('http://localhost:8000/api/categorias');
      setCategorias(categoriasRes.data);

      const editorialesRes = await axios.get('http://localhost:8000/api/editorials');
      setEditoriales(editorialesRes.data);

      const ejemplarResponse = await axios.get(`${ejemplarEndpoint}${bookData.codigolibroID}`);
      setEjemplares(ejemplarResponse.data);

      setEjemplaresdisponibles(ejemplarResponse.data.length.toString());

      // Obtener autores del libro para mostrar como seleccionados
      const autorLibroRes = await axios.get(`http://localhost:8000/api/autorlibros/${libroID}`);
      const autorIDs = autorLibroRes.data.map(autor => autor.autorID.toString());
      setSelectedAutores(autorIDs);
    };

    getBookById();
  }, [id, libroID]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('isbn', isbn);
      formData.append('codigolibroID', codigolibroID);
      formData.append('titulo', titulo);
      formData.append('numeropaginas', numeropaginas);
      //formData.append('ejemplaresdisponibles', ejemplaresdisponibles);
      formData.append('resumen', resumen);
      formData.append('volumen', volumen);
      formData.append('tomo', tomo);
      formData.append('edicion', edicion);
      formData.append('pais', pais);
      formData.append('idioma', idioma);
      formData.append('aniopublicacion', aniopublicacion);
      formData.append('formadeadquisicion', formadeadquisicion);
      formData.append('procedenciaproovedor', procedenciaproovedor);
      formData.append('autor_nombre', autorID); // Autor principal, si aplica
      formData.append('categoria_nombre', categoriaID);
      formData.append('editorial_nombre', editorialID);
      // formData.append('fechaadquisicion', fechaadquisicion);

      if (rutafoto) {
        formData.append('rutafoto', rutafoto);
      }

      await axios.post(`${endpoint}${libroID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const autorNombres = autores
        .filter((autor) => selectedAutores.includes(autor.autorID.toString()))
        .map((autor) => autor.nombre);

      await axios.put(`http://localhost:8000/api/autorlibro/${libroID}`, {
        autor_nombres: autorNombres,
      });

      Swal.fire({
        title: 'Actualización exitosa',
        text: 'El libro y sus autores se han actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      onUpdate();
      onClose();

    } catch (error) {
      console.error('Error al actualizar:', error.response?.data || error.message);
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);



  return (


    <div
      className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-[110rem] w-full relative scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 overflow-y-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ❌
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Editar Libro: {titulo}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Campo: Título */}
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

          {/* Campo: Autores */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
              Autores
            </label>
            <Select
              placeholder="Buscar autores..."
              className="w-full"
              selectionMode="multiple"
              selectedKeys={selectedAutores}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys);
                setSelectedAutores(selected);
              }}
            >
              {autores.map((autor) => (
                <SelectItem key={autor.autorID.toString()}>
                  {autor.nombre}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <form
          onSubmit={handleUpdate}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mt-6"
        >

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


          {/* <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Control Topográfico</label>
            <Input
              value={controltopografico}
              onChange={(e) => setControltopografico(e.target.value)}
              type="text"
              aria-label="Control Topográfico"
              className="w-full"
            />
          </div> */}

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

          {/* <div className="flex flex-col">
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
          </div> */}

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
              isReadOnly
              type="text"
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

          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Foto
            </label>
            <Input type="file" onChange={(e) => setRutafoto(e.target.files[0])} />
          </div>

          {/* Columna para el resumen */}
          <div className="flex flex-col w-full md:col-start-1 md:col-span-4">
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


