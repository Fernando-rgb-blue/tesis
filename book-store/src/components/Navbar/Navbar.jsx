
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { RiLoginBoxFill } from 'react-icons/ri';
import Logo from "../../assets/website/logo.png";
import DarkMode from './DarkMode';

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

const DropdownLinks = [
    {
        name: "Dropdown1",
        link: '/#',
    },
    {
        name: "Dropdown2",
        link: '/#',
    },
    {
        name: "Dropdown3",
        link: '/#',
    },
];

const Navbar = () => {
    const navigate = useNavigate(); // Inicializamos useNavigate
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar la autenticación

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // Verifica si hay un token
    }, []);

    const handleSignIn = () => {
        navigate('/signin'); // Redirigimos al componente Signin.jsx
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
                            {
                                Menu.map((menu) => (
                                    <li key={menu.id}>
                                        <a href={menu.link} className="inline-block ckpy-4 px-4 hover:text-primary duration-200">
                                            {menu.name}
                                        </a>
                                    </li>
                                ))
                            }

                            {isAuthenticated && (
                                <>
                                    {/* Mantenimiento */}
                                    <li className="group relative cursor-pointer">
                                        <a href="/#" className="flex h-[72px] items-center gap-[2px]">
                                            Mantenimiento
                                            <span>
                                                <FaCaretDown className="transition duration-300 group-hover:rotate-180" />
                                            </span>
                                        </a>

                                        <div className="absolute left-9 z-[10] hidden group-hover:block text-black bg-white p-2 shadow-md w-[150px]">
                                            <ul>
                                                <li>
                                                    <a href="/editoriales" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">
                                                        Editorial
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/autores" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">
                                                        Autor
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/categorias" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">
                                                        Categoría
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/usuarios" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">
                                                        Usuarios
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* Gestión de Libros */}
                                    <li className="group relative cursor-pointer">
                                        <a href="/#" className="flex h-[72px] items-center gap-[2px]">
                                            Gestión de Libros
                                            <span>
                                                <FaCaretDown className="transition duration-300 group-hover:rotate-180" />
                                            </span>
                                        </a>

                                        <div className="absolute left-9 z-[10] hidden group-hover:block text-black bg-white p-2 shadow-md w-[150px]">
                                            <ul>
                                                <li>
                                                    <a href="/registro-libro" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">
                                                        Registro
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/archivados" className="inline-block w-full rounded-md p-2 hover:bg-primary/20">
                                                        Archivados
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* Reserva */}
                                    <li>
                                        <a href="/reserva" className="inline-block ckpy-4 px-4 hover:text-primary duration-200">
                                            Reserva
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Botón "Ingresa" modificado */}
                        {!isAuthenticated && ( // Muestra el botón solo si no está autenticado
                            <button
                                className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full flex items-center gap-1 hover:scale-105 duration-300"
                                onClick={handleSignIn} // Llamamos la función para redirigir al componente Signin
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


