import { useLocation } from 'react-router-dom';

const User = () => {
  const location = useLocation();
  const userProfile = location.state?.userProfile || JSON.parse(localStorage.getItem('userProfile')); // Obtener el perfil del usuario

  if (!userProfile) {
    return <div>No hay datos de usuario disponibles.</div>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-11/12 md:w-1/3 bg-yellow-50 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Perfil de Usuario</h2>
        <p className="mb-2"><strong>ID:</strong> {userProfile.id}</p>
        <p className="mb-2"><strong>Nombre:</strong> {userProfile.name}</p>
        <p className="mb-2"><strong>Correo:</strong> {userProfile.email}</p>
        <p className="mb-2"><strong>Creado en:</strong> {new Date(userProfile.created_at).toLocaleString()}</p>
        <p className="mb-2"><strong>Actualizado en:</strong> {new Date(userProfile.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default User;
