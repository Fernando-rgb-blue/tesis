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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShowBooks from "./components/Book/ShowBooks";
import SignIn from "./components/Signin/Signin.jsx";
import SignUp from "./components/Signup/Signup.jsx";
import User from "./components/User/User.jsx";
import EditBooks from "./components/Book/EditBooks.jsx";
import CreateBook from "./components/Book/CreateBooks.jsx";
import DeleteBooks from "./components/Book/DeleteBooks.jsx";
import CreateEjemplar from "./components/Book/Ingresos/CreateEjemplar.jsx";
import ViewBook from "./components/Book/ViewBooks/ViewBooks.jsx";
import { HelmetProvider } from 'react-helmet-async';

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
    <div className="min-h-screen flex flex-col bg-white dark:bg-stone-800 dark:text-white duration-200 ">
      <Navbar handleOrderPopup={handleOrderPopup} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero handleOrderPopup={handleOrderPopup} />
              <Services handleOrderPopup={handleOrderPopup} />
              <Banner />
              <AppStore />
              <Books />
              <Testimonial />
              <Footer />
              <OrderPopup
                orderPopup={orderPopup}
                setOrderPopup={setOrderPopup}
              />
            </>
          }
        />
        {/* Rutas principales */}
        <Route path="/show-books" element={<ShowBooks />} />
        <Route path="/delete-books" element={<DeleteBooks />} />
        <Route path="/view-books/:id" element={<ViewBook />} />
        <Route path="/create-books" element={<CreateBook />} />
        <Route path="/ingresos/create" element={<CreateEjemplar />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </div>
  );
};

// Envolver el componente App en Router para la navegación
const RootApp = () => (
  <HelmetProvider>
    <Router>
      <App />
    </Router>
  </HelmetProvider>
);

export default RootApp;
