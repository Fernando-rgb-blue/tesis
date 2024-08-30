import '../../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import CreateAutor from '../Autor/CreateAutor';
import CreateCategoria from '../Categoria/CreateCategoria';
import CreateEditorial from '../Editorial/CreateEditorial';

// Configurar el elemento principal para el modal
Modal.setAppElement('#root');

const endpoint = `http://localhost:8000/api/libro`;

const CreateBook = () => {
  const [isbn, setIsbn] = useState('');
  const [codigo, setCodigo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autorID, setAutorID] = useState('');
  const [categoriaID, setCategoriaID] = useState('');
  const [editorialID, setEditorialID] = useState('');
  const [aniopublicacion, setAniopublicacion] = useState('');
  const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
  const [edicion, setEdicion] = useState('');
  const [numeropaginas, setNumeropaginas] = useState('');
  const [estadolibro, setEstadolibro] = useState('');
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);

  const navigate = useNavigate();

  // Estados para los modales
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState('');

  const openModal = (modalType) => {
    console.log(`Abriendo modal de tipo: ${modalType}`); // Mensaje en consola
    setActiveModal(modalType);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    console.log('Cerrando modal'); // Mensaje en consola
    setModalIsOpen(false);
  };

  const create = async (e) => {
    e.preventDefault();
    await axios.post(endpoint, {
      isbn,
      codigo,
      titulo,
      autor_nombre: autorID,
      categoria_nombre: categoriaID,
      editorial_nombre: editorialID,
      aniopublicacion,
      ejemplaresdisponibles,
      edicion,
      numeropaginas,
      estadolibro
    });
    navigate('/');
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

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-11/12 h-4/5 text-xs bg-yellow-50 p-4 rounded-md shadow-md overflow-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Libro</h3>

        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ISBN */}
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>ISBN</label>
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Código */}
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Código</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Título */}
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Autor */}
          <div className="flex flex-col">
            <label className='mb-2 text-sm font-medium text-gray-700'>Autor</label>
            <div className="flex">
              <select
                value={autorID}
                onChange={(e) => setAutorID(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Autor</option>
                {autores.map(autor => (
                  <option key={autor.id} value={autor.id}>{autor.nombre}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openModal('autor')}
                className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Categoría */}
          <div className="flex flex-col">
            <label className='mb-2 text-sm font-medium text-gray-700'>Categoría</label>
            <div className="flex">
              <select
                value={categoriaID}
                onChange={(e) => setCategoriaID(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openModal('categoria')}
                className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Editorial */}
          <div className="flex flex-col">
            <label className='mb-2 text-sm font-medium text-gray-700'>Editorial</label>
            <div className="flex">
              <select
                value={editorialID}
                onChange={(e) => setEditorialID(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Editorial</option>
                {editoriales.map(editorial => (
                  <option key={editorial.id} value={editorial.id}>{editorial.nombre}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openModal('editorial')}
                className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Año de Publicación */}
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Año de Publicación</label>
            <input
              value={aniopublicacion}
              onChange={(e) => setAniopublicacion(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Ejemplares Disponibles */}
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Ejemplares Disponibles</label>
            <input
              value={ejemplaresdisponibles}
              onChange={(e) => setEjemplaresdisponibles(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Edición */}
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Edición</label>
            <input
              value={edicion}
              onChange={(e) => setEdicion(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Número de Páginas */}
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Número de Páginas</label>
            <input
              value={numeropaginas}
              onChange={(e) => setNumeropaginas(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Estado del Libro */}
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Estado del Libro</label>
            <input
              value={estadolibro}
              onChange={(e) => setEstadolibro(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='col-span-2'>
            <button type='submit' className='w-full py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors'>
              Crear
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
          <button onClick={closeModal} className="absolute top-2 right-2 text-xl font-bold">&times;</button>
          {activeModal === 'autor' && <CreateAutor closeModal={closeModal} />}
          {activeModal === 'categoria' && <CreateCategoria closeModal={closeModal} />}
          {activeModal === 'editorial' && <CreateEditorial closeModal={closeModal} />}
        </Modal>
      </div>
    </div>
  );
};

export default CreateBook;
