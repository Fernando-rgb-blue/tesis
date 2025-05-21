import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { RiLoginBoxFill, RiUser3Fill } from 'react-icons/ri';
import Logo from "../../assets/website/logo.png";
import DarkMode from './DarkMode';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Menu = [
    { id: 1, name: "Inicio", link: '/#' },
    { id: 2, name: "Librería", link: '/show-books' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null); // Nuevo estado para el tipo de usuario
    const location = useLocation();
    const userProfile = location.state?.userProfile || JSON.parse(localStorage.getItem('userProfile'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        if (userProfile) {
            setUserType(userProfile.tipousuario); // Configura el tipo de usuario
        }

        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                setIsAuthenticated(!!e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [userProfile]);

    const handleSignIn = () => navigate('/signin');

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/logout', {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });

            if (response.data.message === 'Cierre de sesión exitoso') {
                localStorage.removeItem('token');
                localStorage.removeItem('userProfile');
                setIsAuthenticated(false);
                setUserType(null);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error.response ? error.response.data : error.message);
        }
    };

    return (

        <div className=" bg-white dark:bg-stone-800 dark:text-white duration-200 w-full">
            <div className="container py-5 sm:py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="#" className="font-bold text-2xl sm:text-xl flex items-center gap-2">
                            <img src={Logo} alt="" className='w-10' />Biblioteca F.C.F.Y.M
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-white dark:bg-stone-800 rounded-full">
                            <DarkMode />
                        </div>
                        <ul className="items-center gap-4 hidden sm:flex">
                            {Menu.map(menu => (
                                <li key={menu.id}>
                                    <a
                                        href={menu.link}
                                        className="inline-block py-4 px-4 hover:text-primary duration-200"
                                    >
                                        {menu.name}
                                    </a>
                                </li>
                            ))}

                            {isAuthenticated && userType === "Administrador(a)" && (
                                <>
                                    <li className="group relative cursor-pointer">
                                        <a href="/#" className="flex items-center gap-2">
                                            Mantenimiento
                                            <FaCaretDown className="transition duration-300 group-hover:rotate-180" />
                                        </a>
                                        <div className="absolute z-10 hidden group-hover:block text-black bg-white p-2 shadow-md rounded-md w-[150px]">
                                            <ul className="space-y-2">
                                                <li><a href="/editoriales" className="block w-full p-2 hover:bg-primary/20 rounded-md">Editorial</a></li>
                                                <li><a href="/autores" className="block w-full p-2 hover:bg-primary/20 rounded-md">Autor</a></li>
                                                <li><a href="/categorias" className="block w-full p-2 hover:bg-primary/20 rounded-md">Categoría</a></li>
                                                <li><a href="/usuarios" className="block w-full p-2 hover:bg-primary/20 rounded-md">Usuarios</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="/reserva" className="inline-block py-4 px-4 hover:text-primary duration-200">Reserva</a>
                                    </li>
                                </>
                            )}

                            {isAuthenticated && userType === "Alumno(a)" && (
                                <>
                                    <li>
                                        <a href="/#" className="inline-block py-4 px-4 hover:text-primary duration-200">Reservas</a>
                                    </li>
                                </>
                            )}

                            {isAuthenticated && (
                                <li className="group relative cursor-pointer">
                                    <a href="/user" className="flex items-center gap-2">
                                        <RiUser3Fill className="text-3xl" />
                                        <span>{userProfile.name}</span>
                                        <FaCaretDown className="transition duration-300 group-hover:rotate-180" />
                                    </a>
                                    <div className="absolute z-10 hidden group-hover:block text-black bg-white p-2 shadow-md rounded-md w-[150px]">
                                        <ul>
                                            <li>
                                                <button onClick={handleLogout} className="block w-full p-2 hover:bg-primary/20 rounded-md">Cerrar Sesión</button>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )}
                        </ul>

                        {!isAuthenticated && (
                            <button
                                className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full flex items-center gap-2 hover:scale-105 duration-300"
                                onClick={handleSignIn}
                            >
                                Ingresa
                                <RiLoginBoxFill className="text-xl text-white drop-shadow-sm" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
