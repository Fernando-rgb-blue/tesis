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

// Configurar el elemento principal para el modal

Modal.setAppElement('#root');

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

  const navigate = useNavigate();

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
        axios.get('http://localhost:8000/api/autors'),
        axios.get('http://localhost:8000/api/categorias'),
        axios.get('http://localhost:8000/api/editorials')
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

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Autor
            </label>
            <div className="flex items-center">
              <select
                value={autorID} // El valor del select debe ser autorID
                onChange={(e) => setAutorID(e.target.value)} // Actualiza el estado autorID cuando se elige una opción
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Autor</option> {/* Opción por defecto */}
                {autores.map((autor) => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openModal("autor")}
                className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
              >
                +
              </button>
            </div>
          </div>


          {/* Categoría */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Categoría
            </label>
            <div className="flex items-center">
              <select
                value={categoriaID}
                onChange={(e) => setCategoriaID(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openModal("categoria")}
                className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Editorial */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
              Editorial
            </label>
            <div className="flex items-center">
              <select
                value={editorialID}
                onChange={(e) => setEditorialID(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Editorial</option>
                {editoriales.map((editorial) => (
                  <option key={editorial.id} value={editorial.id}>
                    {editorial.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openModal("editorial")}
                className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
              >
                +
              </button>
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
          onRequestClose={closeModal}
          contentLabel="Crear Nuevo"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <button onClick={closeModal} className="absolute top-2 right-2 text-xl font-bold">
            &times;
          </button>
          {activeModal === "autor" && <CreateAutor closeModal={closeModal} />}
          {activeModal === "categoria" && <CreateCategoria closeModal={closeModal} />}
          {activeModal === "editorial" && <CreateEditorial closeModal={closeModal} />}
        </Modal>

      </div>
    </div>
  );

};

export default CreateBook;



