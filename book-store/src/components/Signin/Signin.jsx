import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para redireccionar después de iniciar sesión

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Lógica de autenticación

      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Imprime el token en consola

        // Hacer una solicitud para obtener el perfil del usuario
        const profileResponse = await fetch('http://localhost:8000/api/user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.token}`, // Añadir el token en los headers
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('User Profile:', profileData.userData); // Imprime el perfil del usuario en consola

          // Almacenar el token y el perfil del usuario en localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('userProfile', JSON.stringify(profileData.userData));

          // Recargar la página para que el Navbar se actualice
          window.location.href = '/';
        }
        else {
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
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-11/12 md:w-1/3 bg-yellow-50 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              placeholder="Ingrese su correo"
              className="w-full p-2 mt-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="w-full p-2 mt-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-4 text-center">
          ¿No tienes una cuenta?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
