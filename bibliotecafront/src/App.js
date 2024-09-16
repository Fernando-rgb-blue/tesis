import './App.css';
import ShowBooks from './components/Book/ShowBooks';
import EditBooks from './components/Book/EditBooks';
import CreateBooks from './components/Book/CreateBooks';
import CreateEditorial from './components/Editorial/CreateEditorial';
import CreateCategoria from './components/Categoria/CreateCategoria'; // Importa el componente
import CreateAutor from './components/Autor/CreateAutor'; // Importa el componente
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateEjemplar from './components/Ingresos/CreateEjemplar';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ShowBooks />} />
          <Route path='/create' element={<CreateBooks />} />
          <Route path='/edit/:id' element={<EditBooks />} />
          <Route path='/editorial/create' element={<CreateEditorial />} />
          <Route path='/categoria/create' element={<CreateCategoria />} /> {/* Añade la ruta para categorías */}
          <Route path='/autor/create' element={<CreateAutor />} />
          <Route path='/ingresos/create' element={<CreateEjemplar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
