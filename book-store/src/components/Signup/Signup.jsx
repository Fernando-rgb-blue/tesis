import React, { useState } from 'react';
import { Form, Input, Button } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';

const endpoint = 'http://localhost:8000/api/register';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    dni: '',
    domicilio: '',
    telefono: '',
    fechanacimiento: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      setSuccess(null);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          dni: parseInt(form.dni, 10),
          domicilio: form.domicilio,
          telefono: parseInt(form.telefono, 10),
          fechanacimiento: form.fechanacimiento,
          email: form.email,
          password: form.password,
          password_confirmation: form.passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registro exitoso');
        setError(null);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError(data.message || 'Error al registrar. Inténtalo nuevamente.');
        setSuccess(null);
      }
    } catch {
      setError('Error de conexión. Inténtalo nuevamente.');
      setSuccess(null);
    }
  };

  return (


    <div className="mt-[0.8cm] flex flex-col md:flex-row bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-[110rem] mx-auto overflow-y-auto max-h-[100vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

      {/* Imagen */}
      <div className="w-full md:w-[50%] xl:w-[35%] 2xl:w-[40%] h-64 md:h-auto">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
          alt="Registro"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulario */}
      <div className="w-full md:w-[50%] xl:w-[65%] 2xl:w-[60%] p-8">

        <h2 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-6 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md mb-6 text-center">
            {success}
          </div>
        )}

        <Form className="w-full" onSubmit={handleSubmit}>

          {/* Fila 1: Nombre Completo */}
          <div className="w-full mb-6">
            <Input
              label="Nombre Completo"
              name="name"
              placeholder="Ingrese su nombre"
              isRequired
              value={form.name}
              onChange={handleChange}
              labelPlacement="outside"
            />
          </div>

          {/* Fila 2: DNI, Fecha de Nacimiento, Teléfono */}
          <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 w-full">
            <Input
              label="DNI"
              name="dni"
              type="number"
              placeholder="Ingrese su DNI"
              isRequired
              value={form.dni}
              onChange={handleChange}
              labelPlacement="outside"
              className="flex-1"
            />
            <Input
              label="Fecha de Nacimiento"
              name="fechanacimiento"
              type="date"
              placeholder="Ingrese su fecha de nacimiento"
              isRequired
              value={form.fechanacimiento}
              onChange={handleChange}
              labelPlacement="outside"
              className="flex-1 mt-4 sm:mt-0"
            />
            <Input
              label="Teléfono"
              name="telefono"
              type="number"
              placeholder="Ingrese su teléfono"
              isRequired
              value={form.telefono}
              onChange={handleChange}
              labelPlacement="outside"
              className="flex-1 mt-4 sm:mt-0"
            />
          </div>

          {/* Fila 3: Domicilio */}
          <div className="w-full mb-6">
            <Input
              label="Domicilio"
              name="domicilio"
              placeholder="Ingrese su domicilio"
              isRequired
              value={form.domicilio}
              onChange={handleChange}
              labelPlacement="outside"
            />
          </div>

          {/* Fila 4: Correo Electrónico */}
          <div className="w-full mb-6">
            <Input
              type="email"
              label="Correo Electrónico"
              name="email"
              placeholder="Ingrese su correo"
              isRequired
              value={form.email}
              onChange={handleChange}
              labelPlacement="outside"
              errorMessage="Por favor ingresa un correo válido"
            />
          </div>

          {/* Fila 5: Contraseña y Confirmar Contraseña */}
          <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 w-full">
            <Input
              type="password"
              label="Contraseña"
              name="password"
              placeholder="Cree una contraseña"
              isRequired
              value={form.password}
              onChange={handleChange}
              labelPlacement="outside"
              className="flex-1"
            />
            <Input
              type="password"
              label="Confirmar Contraseña"
              name="passwordConfirmation"
              placeholder="Confirme su contraseña"
              isRequired
              value={form.passwordConfirmation}
              onChange={handleChange}
              labelPlacement="outside"
              className="flex-1 mt-4 sm:mt-0"
            />
          </div>

          <Button type="submit" variant="bordered" className="mt-6 w-full">
            Registrarse
          </Button>

        </Form>


        <p className="mt-6 text-center">
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
