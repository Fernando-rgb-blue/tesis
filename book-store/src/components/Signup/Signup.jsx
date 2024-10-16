import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const endpoint = 'http://localhost:8000/api/register'; // Endpoint del backend

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de las contraseñas
    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation, // Laravel espera "password_confirmation"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso
        setSuccess('Registro exitoso');
        setError(null);
        setTimeout(() => {
          navigate('/signin'); // Redirigir al usuario al iniciar sesión después de registrarse
        }, 2000);
      } else {
        // Si ocurre un error
        setError(data.message || 'Error al registrar. Inténtalo nuevamente.');
        setSuccess(null);
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo nuevamente.');
      setSuccess(null);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-11/12 md:w-1/3 bg-yellow-50 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Crear Cuenta</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-2 rounded-md mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre Completo</label>
            <input
              type="text"
              placeholder="Ingrese su nombre"
              className="w-full p-2 mt-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Cree una contraseña"
              className="w-full p-2 mt-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Confirme su contraseña"
              className="w-full p-2 mt-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-center">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
