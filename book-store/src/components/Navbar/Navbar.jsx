import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { RiLoginBoxFill } from 'react-icons/ri';
import { RiUser3Fill } from 'react-icons/ri';
import Logo from "../../assets/website/logo.png";
import DarkMode from './DarkMode';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Menu = [
    {
        id: 1,
        name: "Inicio",
        link: '/#',
    },
    {
        id: 2,
        name: "Libreria",
        link: '/#services',
    },
];

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();
    const userProfile = location.state?.userProfile || JSON.parse(localStorage.getItem('userProfile'));

    // Verifica si hay un token en localStorage al cargar
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        // Escuchar cambios en localStorage para actualizar el estado
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                setIsAuthenticated(!!e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Limpiar el evento al desmontar el componente
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleSignIn = () => {
        navigate('/signin'); // Redirigimos al componente Signin.jsx
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.message === 'Cierre de sesión exitoso') {
                localStorage.removeItem('token');
                setIsAuthenticated(false); // Actualiza el estado a no autenticado
            }
            console.log('Logout response:', response.data);
        } catch (error) {
            console.error('Error al cerrar sesión:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="shadow-lg bg-white rounded dark:bg-gray-900 dark:text-white duration-100">
            <div className="container py-3 sm:py-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="#" className="font-bold text-2xl sm:text-xl flex items-center gap-2">
                            <img src={Logo} alt="" className='w-10' />Biblioteca F.C.F.Y.M
                        </a>
                    </div>

                    <div className="flex items-center justify-between gap-3 font-semibold">
                        <div>
                            <DarkMode />
                        </div>

                        <ul className="items-center gap-4 hidden sm:flex ">
                            {Menu.map((menu) => (
                                <li key={menu.id}>
                                    <a href={menu.link} className="inline-block ckpy-4 px-4 hover:text-primary duration-200">
                                        {menu.name}
                                    </a>
                                </li>
                            ))}
                            {isAuthenticated && (
                                <>
                                    <li className="group relative cursor-pointer">
                                        <a href="/#" className="flex h-[72px] items-center gap-[2px]">
                                            Mantenimiento
                                            <span>
                                                <FaCaretDown className="transition duration-300 group-hover:rotate-180" />
                                            </span>
                                        </a>
                                        <div className="absolute left-9 z-[10] hidden group-hover:block text-black bg-white p-2 shadow-md w-[150px]">
                                            <ul>
                                                <li><a href="/editoriales" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">Editorial</a></li>
                                                <li><a href="/autores" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">Autor</a></li>
                                                <li><a href="/categorias" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">Categoría</a></li>
                                                <li><a href="/usuarios" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">Usuarios</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="/reserva" className="inline-block ckpy-4 px-4 hover:text-primary duration-200">Reserva</a>
                                    </li>
                                    <li className="group relative cursor-pointer">
                                        <a href="/user" className="flex h-[72px] items-center gap-[2px]">
                                            <RiUser3Fill className="text-3xl" />
                                            <span className="ml-2">{userProfile.name}</span>
                                            <FaCaretDown className="transition duration-300 group-hover:rotate-180" />
                                        </a>
                                        <div className="absolute left-9 z-[10] hidden group-hover:block text-black bg-white p-2 shadow-md w-[150px]">
                                            <ul>
                                                <li>
                                                    <button onClick={handleLogout} className="block w-full p-2 hover:bg-primary/20">Cerrar Sesión</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </>
                            )}
                        </ul>

                        {!isAuthenticated && (
                            <button
                                className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full flex items-center gap-1 hover:scale-105 duration-300"
                                onClick={handleSignIn}
                            >
                                Ingresa
                                <RiLoginBoxFill className="text-xl text-white drop-shadow-sm cursor-pointer" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

