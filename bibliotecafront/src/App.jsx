import React from "react";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import Services from "./components/Services/Services.jsx";
import Banner from "./components/Banner/Banner.jsx";
import AppStore from "./components/AppStore/AppStore.jsx";
import Testimonial from "./components/Testimonial/Testimonial.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import OrderPopup from "./components/OrderPopup/OrderPopup.jsx";
import Books from "./components/BooksSlider/Books.jsx";
import './App.css';
import ShowBooks from './components/Book/ShowBooks';
import EditBooks from './components/Book/EditBooks';
import CreateBooks from './components/Book/CreateBooks';
import CreateEditorial from './components/Editorial/CreateEditorial';
import CreateCategoria from './components/Categoria/CreateCategoria';
import CreateAutor from './components/Autor/CreateAutor';
import CreateEjemplar from './components/Ingresos/CreateEjemplar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <BrowserRouter>
        <Navbar handleOrderPopup={handleOrderPopup} />
        {/* Componente Hero y otros que quieres mostrar siempre */}
        <Hero handleOrderPopup={handleOrderPopup} />
        <Services handleOrderPopup={handleOrderPopup} />
        <Banner />
        <AppStore />
        <Books />
        <Testimonial />
        <Footer />
        <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      </BrowserRouter>
    </div>
  );
};

export default App;
