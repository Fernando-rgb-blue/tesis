import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookDefault from '../../assets/login.png';
import { Input, Button } from '@heroui/react';

import { FaEnvelope, FaLock } from 'react-icons/fa'; // o importa MailIcon y LockClosedIcon de '@heroicons/react/24/outline'

export const MailIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const LockIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
        fill="none"
      />
    </svg>
  );
};



const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const profileResponse = await fetch('http://localhost:8000/api/user', {
          method: 'GET',
          headers: { Authorization: `Bearer ${data.token}` },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();

          localStorage.setItem('token', data.token);
          localStorage.setItem('userProfile', JSON.stringify(profileData.userData));

          navigate('/');
        } else {
          console.error('Error al obtener el perfil del usuario');
        }
      } else {
        const errorData = await response.json();
        console.error('Error de autenticación:', errorData.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


  return (

      
      <div className="mt-[4cm] flex flex-col md:flex-row bg-slate-50 dark:bg-stone-900 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-[85rem] mx-auto overflow-y-auto max-h-[100vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 justify-center bg-gradient-to-br">


        <div className="hidden md:flex md:w-1/2 items-center justify-center dark:bg-transparent p-4">
          <img
            src={BookDefault}
            alt="Login"
            className="max-h-72 object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 bg-transparent dark:bg-stone-900 ">
          {/* Título separado abajo con mb-20 (5rem = 80px aprox) */}
          <h2 className="text-3xl font-bold text-black-300 mb-20 text-center">
            Inicia sesión
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Cada input con mb-20 para separar 2cm aprox */}
            <div className="mb-10">
              <Input
                label="Email"
                labelPlacement="outside"
                placeholder="Correo del usaurio"
                startContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-10">
              <Input
                label="Contraseña"
                labelPlacement="outside"
                placeholder="Ingrese su contraseña"
                startContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Checkbox con margen abajo para separar también */}
            <div className="flex items-center space-x-2 mb-10">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="form-checkbox h-4 w-4 text-black-400"
              />
              <label htmlFor="remember" className="text-gray-600 text-sm select-none">
                ¿Mantener sesión iniciada?
              </label>
            </div>

            <Button type="submit" color="success" fullWidth>
              Iniciar sesión
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/signup" className="text-black-600 font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>


      </div>

  );
  
};

export default SignIn;
