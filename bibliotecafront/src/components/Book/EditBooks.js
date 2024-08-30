import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const endpoint = `http://localhost:8000/api/libro/`;

const EditBooks = () => {

  const [isbn, setIsbn] = useState('');
  const [codigo, setCodigo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tituloOriginal, setTituloOriginal] = useState('');
  const [autor_nombre, setAutorID] = useState('');
  const [categoria_nombre, setCategoriaID] = useState('');
  const [editorial_nombre, setEditorialID] = useState('');
  const [aniopublicacion, setAniodepublicacion] = useState('');
  const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
  const [edicion, setEdicion] = useState('');
  const [numeropaginas, setNumeropaginas] = useState('');
  const [estadolibro, setEstadolibro] = useState('');
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);

  const { id } = useParams()

  const navigate = useNavigate()

  const update = async (e) => {

    e.preventDefault()
    await axios.put(`${endpoint}${id}`, {
      isbn: isbn,
      codigo: codigo,
      titulo: titulo,
      autor_nombre: autor_nombre,
      categoria_nombre: categoria_nombre,
      editorial_nombre: editorial_nombre,
      aniopublicacion: aniopublicacion,
      ejemplaresdisponibles: ejemplaresdisponibles,
      edicion: edicion,
      numeropaginas: numeropaginas,
      estadolibro: estadolibro
    });
    navigate('/')
  }

  useEffect(() => {

    const getBookById = async () => {

      const response = await axios.get(`${endpoint}${id}`)

      //Prueba En Consola
      const bookData = response.data;
      console.log('Book Data:', bookData);
      //Prueba En Consola

      setIsbn(response.data.isbn);
      setCodigo(response.data.codigo);
      setTituloOriginal(response.data.titulo);
      setTitulo(response.data.titulo);
      setAutorID(response.data.autorID);
      setCategoriaID(response.data.categoriaID);
      setEditorialID(response.data.editorialID);
      setAniodepublicacion(response.data.aniopublicacion);
      setEjemplaresdisponibles(response.data.ejemplaresdisponibles);
      setEdicion(response.data.edicion);
      setNumeropaginas(response.data.numeropaginas);
      setEstadolibro(response.data.estadolibro);

      const autoresResponse = await axios.get('http://localhost:8000/api/autors');
      setAutores(autoresResponse.data);

      const categoriasResponse = await axios.get('http://localhost:8000/api/categorias');
      setCategorias(categoriasResponse.data);

      const editorialesResponse = await axios.get('http://localhost:8000/api/editorials');
      setEditoriales(editorialesResponse.data);
    }
    getBookById()
  }, [id])


  return (
    <div className="h-screen flex items-center justify-center bg-gray-100"> {/* Contenedor principal centrado */}
      <div className="w-11/12 h-4/5 text-xs bg-yellow-50 p-4 rounded-md shadow-md overflow-auto">

        <h3 className="text-2xl font-bold mb-6 text-center">Actualizar Libro : {tituloOriginal}</h3>

        <form onSubmit={update} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>ISBN</label>
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Código</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className="flex flex-col">
            <label className='mb-2 text-sm font-medium text-gray-700'>Autor</label>
            <select
              value={autor_nombre}
              onChange={(e) => setAutorID(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {/* <option value="">{autor_nombre}</option> */}
              {autores.map(autor => (
                <option key={autor.id} value={autor.id}>{autor.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className='mb-2 text-sm font-medium text-gray-700'>Categoría</label>
            <select
              value={categoria_nombre}
              onChange={(e) => setCategoriaID(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {/* <option value="">{categoria_nombre}</option> */}
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className='mb-2 text-sm font-medium text-gray-700'>Editorial</label>
            <select
              value={editorial_nombre}
              onChange={(e) => setEditorialID(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {/* <option value="">{editorial_nombre}</option> */}
              {editoriales.map(editorial => (
                <option key={editorial.id} value={editorial.id}>{editorial.nombre}</option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Año de Publicación</label>
            <input
              value={aniopublicacion}
              onChange={(e) => setAniodepublicacion(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Ejemplares Disponibles</label>
            <input
              value={ejemplaresdisponibles}
              onChange={(e) => setEjemplaresdisponibles(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Edición</label>
            <input
              value={edicion}
              onChange={(e) => setEdicion(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Número de Páginas</label>
            <input
              value={numeropaginas}
              onChange={(e) => setNumeropaginas(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

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
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );



}

export default EditBooks
