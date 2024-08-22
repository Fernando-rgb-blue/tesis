import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const endpoint = `http://localhost:8000/api/libro/`;

const EditBooks = () => {
    
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState('')
    const [stock, setStock] = useState('')
    const {id} = useParams()

    const navigate = useNavigate()

    const update = async (e) => {

        e.preventDefault() 
        await axios.put(`${endpoint}${id}`, { descripcion: descripcion, precio: precio, stock: stock })
        navigate('/')
    }

    useEffect( ()=>{
        const getBookById = async () => {
            const response = await axios.get(`${endpoint}${id}`)
            setDescripcion(response.data.descripcion)
            setPrecio(response.data.precio)
            setStock(response.data.stock)
        }
        getBookById()
    }, [])

    
  return (
    <div>
      <h3> Crear Libro </h3>
      <form onSubmit={update}>
        
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

        <button type='submit' className='btn btn-primary'> actualizar </button>
      </form>
    </div>
  )
}

export default EditBooks
