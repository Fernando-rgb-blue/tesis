import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const endpoint = 'http://localhost:8000/api/libro';


const CreateBooks = () => {

  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const navigate = useNavigate()

  const store = async (e) => {

    e.preventDefault()
    await axios.post(endpoint, { descripcion: descripcion, precio: precio, stock: stock })
    navigate('/')
  }

  return (
    <div>
      <h3> Crear Libro </h3>
      <form onSubmit={store}>
        
        <div className='mb-3'>
          <label className='form-label'> Descripción </label>
          
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            type='text'
            className='form-control'
          />

        </div>

        <div className='mb-3'>
          <label className='form-label'> Precio </label>
          
          <input
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            type='text'
            className='form-control'
          />

        </div>

        <div className='mb-3'>
          <label className='form-label'> Stock </label>
          
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type='text'
            className='form-control'
          />

        </div>

        <button type='submit' className='btn btn-primary'> Crear </button>
      </form>
    </div>
  )

}

export default CreateBooks
