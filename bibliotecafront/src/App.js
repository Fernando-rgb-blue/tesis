import './App.css';
import ShowBooks from './components/ShowBooks';
import EditBooks from './components/EditBooks';
import CreateBooks from './components/CreateBooks';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element= {<ShowBooks/>} />
        <Route path='/create' element= {<CreateBooks/>}/>
        <Route path='/edit/:id' element= {<EditBooks/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
