import { useLocation } from 'react-router-dom';

const User = () => {
  const location = useLocation();
  const userProfile = location.state?.userProfile || JSON.parse(localStorage.getItem('userProfile')); // Obtener el perfil del usuario

  if (!userProfile) {
    return <div>No hay datos de usuario disponibles.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8 mt-8">
        {/* Encabezado con imagen y detalles básicos */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <img
              src={userProfile.profileImage || 'https://via.placeholder.com/100'}
              alt="User Profile"
              className="w-28 h-28 rounded-full border-2 border-gray-300 mr-6"
            />
            <div>
              <h2 className="text-3xl font-bold">{userProfile.name}</h2>
              <p className="text-gray-600">{userProfile.role}</p>
              <p className="text-sm text-gray-500">{userProfile.location}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 text-right">
            <p><strong>Creado en:</strong> {new Date(userProfile.created_at).toLocaleString()}</p>
            <p><strong>Actualizado en:</strong> {new Date(userProfile.updated_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Información adicional del perfil */}
        <div className="mt-8">
          <p className="text-lg text-gray-700 mb-4">
            <strong>Correo:</strong> {userProfile.email}
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-600 mb-2">Acerca de</h3>
            <p className="text-gray-700">{userProfile.about || 'Información no disponible.'}</p>
          </div>
        </div>

        {/* Lista de aptitudes */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-600 mb-4">Principales aptitudes</h3>
          <ul className="list-disc list-inside text-gray-700">
            {userProfile.skills ? (
              userProfile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))
            ) : (
              <li>No se han añadido aptitudes.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default User;
