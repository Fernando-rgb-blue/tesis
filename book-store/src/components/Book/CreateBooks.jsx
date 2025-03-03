import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import CreateAutor from './Autor/CreateAutor';
import { Textarea } from "@nextui-org/react";
import CreateCategoria from './Categoria/CreateCategoria';
import CreateEditorial from './Editorial/CreateEditorial';
import { Input } from '@nextui-org/react';
import Select from 'react-select';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

// Configurar el elemento principal para el modal

Modal.setAppElement('#root');

const BASE_URL = "http://localhost:8000/api";
const endpoint = `http://localhost:8000/api/libro`;

const CreateBook = () => {
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
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState('');
  const [foto, setFoto] = useState(null);
  const [autorNombre, setAutorNombre] = useState('');

  const navigate = useNavigate();

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  const fetchAutores = async () => {
    try {
      const response = await fetch(`${BASE_URL}/autors`); // Reemplaza con la ruta correcta de tu backend
      const data = await response.json();
      setAutores(data);
    } catch (error) {
      console.error("Error al obtener los autores:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categorias`); // Reemplaza con la ruta correcta de tu backend
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener los autores:", error);
    }
  };

  const fetchEditoriales = async () => {
    try {
      const response = await fetch(`${BASE_URL}/editorials`); // Reemplaza con la ruta correcta de tu backend
      const data = await response.json();
      setEditoriales(data);
    } catch (error) {
      console.error("Error al obtener los autores:", error);
    }
  };

  
  const closeModalAndReload = () => {
    closeModal(); // Cierra el modal
    fetchAutores(); // Recarga la lista de autores
    fetchCategorias();
    fetchEditoriales();
  };



  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
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

      if (foto) {
        formData.append('rutafoto', foto);
      }

      const libroResponse = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Datos del libro:', libroResponse.data);
      navigate('/ingresos/create', { state: { codigolibroID, ejemplaresdisponibles } });
    } catch (error) {
      console.error('Error al crear el libro:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [autoresResponse, categoriasResponse, editorialesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/autors`),
        axios.get(`${BASE_URL}/categorias`),
        axios.get(`${BASE_URL}/editorials`)
      ]);

      setAutores(autoresResponse.data);
      setCategorias(categoriasResponse.data);
      setEditoriales(editorialesResponse.data);
    };

    fetchData();
  }, []);

  const autorOptions = autores.map((autor) => ({
    value: autor.id,
    label: autor.nombre,
  }));

  const handleChange = (selectedOption) => {
    setAutorID(selectedOption ? selectedOption.value : "");
  };


  return (
    <div className="h-[calc(100vh-88px)] flex items-center justify-center bg-gray-200 dark:bg-black">
      <div className="w-11/12 lg:w-3/4 xl:w-2/3 text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-md shadow-md overflow-auto">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          Crear Nuevo Libro
        </h3>

        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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
              <Button color="success" onClick={() => openModal("autor")}>
                +
              </Button>
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
              <Button color="success" onClick={() => openModal("categoria")}>
                +
              </Button>
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


              <Button color="success" onClick={() => openModal("editorial")}>
                +
              </Button>

            </div>
          </div>


          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100 ">Control Topográfico</label>
            <Input
              value={controltopografico}
              onChange={(e) => setControltopografico(e.target.value)}
              type="text"
              aria-label="Control Topográfico"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100">Código</label>
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
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100">Volumen</label>
            <Input
              value={volumen}
              onChange={(e) => setVolumen(e.target.value)}
              type="text"
              aria-label="Volumen"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100">Tomo</label>
            <Input
              value={tomo}
              onChange={(e) => setTomo(e.target.value)}
              type="text"
              aria-label="Tomo"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100 ">Pais</label>
            <Input
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              type="text"
              aria-label="Pais"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100 ">Idioma</label>
            <Input
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              type="text"
              aria-label="Idioma"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100 ">Forma de Adquisición</label>
            <Input
              value={formadeadquisicion}
              onChange={(e) => setFormadeadquisicion(e.target.value)}
              type="text"
              aria-label="Forma de Adquisición"
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100">Precio</label>
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
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100 ">Procedencia del Proveedor</label>
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

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Subir Foto
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Columna para los botones */}
          <div className="flex flex-col space-y-4 w-full">

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-md"
            >
              Guardar
            </button>
          </div>

        </form>


        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModalAndReload} // Llamamos la función modificada
          contentLabel="Crear Nuevo"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <button onClick={closeModalAndReload} className="absolute top-2 right-2 text-xl font-bold">
            &times;
          </button>
          {activeModal === "autor" && <CreateAutor closeModal={closeModalAndReload} />}
          {activeModal === "categoria" && <CreateCategoria closeModal={closeModalAndReload} />}
          {activeModal === "editorial" && <CreateEditorial closeModal={closeModalAndReload} />}
        </Modal>

      </div>
    </div>
  );

};

export default CreateBook;
