import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import CreateAutor from './Autor/CreateAutor';
import CreateCategoria from './Categoria/CreateCategoria';
import CreateEditorial from './Editorial/CreateEditorial';
import { Input } from '@nextui-org/react';
import Select from 'react-select'
// Configurar el elemento principal para el modal
Modal.setAppElement('#root');

const endpoint = `http://localhost:8000/api/libro`;

const CreateBook = () => {
  const [isbn, setIsbn] = useState('');
  const [codigolibroID, setCodigoLibroID] = useState('');
  const [titulo, setTitulo] = useState('');
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState('');

  const navigate = useNavigate();

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      const libroResponse = await axios.post(endpoint, {
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
        tomo
      });

      console.log('Datos del libro:', libroResponse.data); // Agregar esto para depuración

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


  // Mapear los autores para adaptarlos al formato de `react-select`
  const autorOptions = autores.map((autor) => ({
    value: autor.id,
    label: autor.nombre,
  }));

  // Manejar cambios en el selector
  const handleChange = (selectedOption) => {
    setAutorID(selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="h-[calc(100vh-88px)] flex items-center justify-center bg-gray-200 dark:bg-black">
      <div className="w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 h-auto max-h-[90vh] text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-md shadow-md overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          Crear Nuevo Libro
        </h3>

        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ISBN */}
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

          {/* Código */}
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

          {/* Título */}
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



          {/* Año de Publicación */}
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

          {/* Ejemplares Disponibles */}
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

          {/* Edición */}
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

          {/* Número de Páginas */}
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

          {/* Volumen */}
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

          {/* Tomo */}
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

          {/* Botón Guardar */}
          <div className="flex justify-center col-span-2 mt-6">
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



