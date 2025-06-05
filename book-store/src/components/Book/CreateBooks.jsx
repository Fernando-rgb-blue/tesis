import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import CreateAutor from './Autor/CreateAutor';
// import Select from 'react-select';
import CreateCategoria from './Categoria/CreateCategoria';
import CreateEditorial from './Editorial/CreateEditorial';
import { Input } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react"
import { Helmet } from 'react-helmet-async';

// Configurar el elemento principal para el modal

Modal.setAppElement('#root');

const BASE_URL = "http://localhost:8000/api";
const endpoint = `http://localhost:8000/api/libro`;

const CreateBook = () => {
  const [isbn, setIsbn] = useState('');
  const [codigolibroID, setCodigoLibroID] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autorID, setAutorID] = useState('');
  const [numeropaginas, setNumeropaginas] = useState('');
  const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
  const [resumen, setResumen] = useState('');
  const [voltomejemp, setVoltomejemp] = useState('');
  const [edicion, setEdicion] = useState('');
  const [editorialID, setEditorialID] = useState('');
  const [pais, setPais] = useState('');
  const [idioma, setIdioma] = useState('');
  const [aniopublicacion, setAniopublicacion] = useState('');
  const [formadeadquisicion, setFormadeadquisicion] = useState('');
  const [procedenciaproovedor, setProcedenciaproovedor] = useState('');
  const [autores, setAutores] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState('');
  const [foto, setFoto] = useState(null);
  const [autorNombre, setAutorNombre] = useState('');
  const [query, setQuery] = useState("")
  const [selectedAutores, setSelectedAutores] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false);

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
      formData.append('codigolibroID', codigolibroID);
      formData.append('titulo', titulo);
      formData.append('numeropaginas', numeropaginas);
      formData.append('ejemplaresdisponibles', ejemplaresdisponibles);
      formData.append('resumen', resumen);
      formData.append('voltomejemp', voltomejemp);
      formData.append('edicion', edicion);
      formData.append('pais', pais);
      formData.append('idioma', idioma);
      formData.append('aniopublicacion', aniopublicacion);
      formData.append('formadeadquisicion', formadeadquisicion);
      formData.append('procedenciaproovedor', procedenciaproovedor);
      formData.append('autor_nombre', autorID);
      formData.append('editorial_nombre', editorialID);
      if (foto) {
        formData.append('rutafoto', foto);
      }

      const libroResponse = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const libroID = libroResponse.data?.id || libroResponse.data?.libro?.id;

      if (!libroID) {
        throw new Error('No se pudo obtener el ID del libro.');
      }

      console.log("📕 Libro creado con ID:", libroID);

      // Paso 2: Enviar los autores
      const autorNombres = autores
        .filter((autor) => selectedAutores.includes(autor.autorID.toString()))
        .map((autor) => autor.nombre);

      await axios.post(`${BASE_URL}/autorlibro/${libroID}`, {
        autor_nombres: autorNombres
      });

      console.log("✅ Autores asociados correctamente al libro.");

      navigate('/ingresos/create', {
        state: {
          codigolibroID,
          ejemplaresdisponibles,
          showSuccess: true
        }
      });

    } catch (error) {
      console.error('Error al crear el libro o los autores:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [autoresResponse, editorialesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/autors`),
        axios.get(`${BASE_URL}/editorials`)
      ]);

      setAutores(autoresResponse.data);
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

  // Filtro para búsqueda

  const filteredAutores =
    query === ""
      ? autores
      : autores.filter((autor) =>
        autor.nombre.toLowerCase().includes(query.toLowerCase())
      )

  const toggleAutor = (autor) => {
    const exists = selectedAutores.some((a) => a._id === autor._id)
    if (exists) {
      setSelectedAutores(selectedAutores.filter((a) => a._id !== autor._id))
    } else {
      setSelectedAutores([...selectedAutores, autor])
    }
  }


  return (
    <>

      <Helmet>
        <title>Crear Nuevo Libro</title>
        <meta name="description" content="Formulario para registrar un nuevo libro en la biblioteca" />
      </Helmet>

      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-[110rem] mx-auto mt-20 overflow-y-auto max-h-[100vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          Crear Nuevo Libro
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Título
            </label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              type="text"
              aria-label="Título"
              className="w-full"
              isRequired
            />
          </div>

          {/* Autor */}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
              Autores
            </label>
            <div className="flex items-center gap-2">
              <Select
                placeholder="Buscar autores..."
                className="w-full"
                selectionMode="multiple"
                selectedKeys={selectedAutores}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys);
                  setSelectedAutores(selected);

                  // Filtrar autores por su ID como string
                  const nombresSeleccionados = autores
                    .filter((autor) => selected.includes(autor.autorID.toString()))
                    .map((autor) => autor.nombre);

                  console.log("Autores seleccionados (Nombres):", nombresSeleccionados);
                }}
              >
                {autores.map((autor) => (
                  <SelectItem key={autor.autorID.toString()}>{autor.nombre}</SelectItem>
                ))}
              </Select>
              <Button color="success" onPress={() => openModal("autor")}>
                +
              </Button>
            </div>
          </div>
        </div>

        <form
          onSubmit={create}
          className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-6 mt-6"
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              ISBN
            </label>
            <Input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              type="text"
              isRequired
              aria-label="ISBN"
              className="w-full"
            />
          </div>

          {/* Editorial */}

          <div className="flex flex-col ">
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
              >
                {editoriales.map((editorial) => (
                  <AutocompleteItem key={editorial.nombre} textValue={editorial.nombre}>
                    {editorial.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              <Button color="success" onPress={() => openModal("editorial")}>
                +
              </Button>

            </div>
          </div>

          {/* Editorial */}

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
            <label className="mb-2 text-sm font-medium text-gray-700  dark:text-gray-100">Volu. Tomo o Ejemplar</label>
            <Input
              value={voltomejemp}
              onChange={(e) => setVoltomejemp(e.target.value)}
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
              Fecha de Publicación
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
          <div className="flex flex-col w-full md:col-start-1 md:col-span-3">
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

          <div className="flex flex-col ">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Subir Foto
            </label>

            <Input
              type="file"
              onChange={handleFileChange}
            />
          </div>
          
          {/* Columna para los botones */}

          <div className="col-span-full flex justify-center gap-4 mt-6">
            <Button
              type="submit"
              color="primary"
            >
              Guardar
            </Button>
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

          {activeModal === "editorial" &&
            <CreateEditorial
              isOpen={modalIsOpen}
              onOpenChange={(isOpen) => {
                if (!isOpen) closeModalAndReload(); // Usa la nueva función aquí también
              }}
              closeModal={closeModalAndReload} // <-- para usarla dentro del modal
            />
          }

          {activeModal === "autor" &&
            <CreateAutor
              isOpen={modalIsOpen}
              onOpenChange={(isOpen) => {
                if (!isOpen) closeModalAndReload(); // Usa la nueva función aquí también
              }}
              closeModal={closeModalAndReload} // <-- para usarla dentro del modal
            />
          }

        </Modal>
      </div>

    </>

  );
};

export default CreateBook;
