import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const endpoint = `http://159.65.183.18:8000/api/libro/`;

const EditBooks = () => {

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

  const { id } = useParams()

  const navigate = useNavigate()

  const update = async (e) => {

    e.preventDefault()
    await axios.put(`${endpoint}${id}`, {
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
      setCodigoLibroID(response.data.codigolibroID);
      setTitulo(response.data.titulo);
      setAutorID(response.data.autorID);
      setCategoriaID(response.data.categoriaID);
      setEditorialID(response.data.editorialID);
      setAniopublicacion(response.data.aniopublicacion);
      setEjemplaresdisponibles(response.data.ejemplaresdisponibles);
      setEdicion(response.data.edicion);
      setNumeropaginas(response.data.numeropaginas);
      setVolumen(response.data.volumen);
      setTomo(response.data.tomo);


      const autoresResponse = await axios.get('http://159.65.183.18:8000/api/autors');
      setAutores(autoresResponse.data);

      const categoriasResponse = await axios.get('http://159.65.183.18:8000/api/categorias');
      setCategorias(categoriasResponse.data);

      const editorialesResponse = await axios.get('http://159.65.183.18:8000/api/editorials');
      setEditoriales(editorialesResponse.data);
    }
    getBookById()
  }, [id])


  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-11/12 h-4/5 text-xs bg-yellow-50 p-4 rounded-md shadow-md overflow-auto">
  
        <h3 className="text-2xl font-bold mb-6 text-center">Actualizar Libro : {titulo}</h3>
  
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
              value={codigolibroID}
              onChange={(e) => setCodigoLibroID(e.target.value)}
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
              value={autorID}
              onChange={(e) => setAutorID(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {autores.map(autor => (
                <option key={autor.id} value={autor.id}>{autor.nombre}</option>
              ))}
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className='mb-2 text-sm font-medium text-gray-700'>Categoría</label>
            <select
              value={categoriaID}
              onChange={(e) => setCategoriaID(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
              ))}
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className='mb-2 text-sm font-medium text-gray-700'>Editorial</label>
            <select
              value={editorialID}
              onChange={(e) => setEditorialID(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {editoriales.map(editorial => (
                <option key={editorial.id} value={editorial.id}>{editorial.nombre}</option>
              ))}
            </select>
          </div>
  
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Año de Publicación</label>
            <input
              value={aniopublicacion}
              onChange={(e) => setAniopublicacion(e.target.value)}
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
            <label className='mb-2 text-sm font-medium text-gray-700'>Volumen</label>
            <input
              value={volumen}
              onChange={(e) => setVolumen(e.target.value)}
              type='text'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
  
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-gray-700'>Tomo</label>
            <input
              value={tomo}
              onChange={(e) => setTomo(e.target.value)}
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
